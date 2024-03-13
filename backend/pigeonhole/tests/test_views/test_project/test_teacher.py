from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/projects/'


class ProjectTestTeacher(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.teacher = User.objects.create(
            username="teacher_username",
            email="test@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
            role=2
        )

        self.course = Course.objects.create(
            name="Test Course",
            description="Test Course Description",
        )

        self.course_not_of_teacher = Course.objects.create(
            name="Test Course 2",
        )

        self.teacher.course.set([self.course])

        self.project = Project.objects.create(
            name="Test Project",
            course_id=self.course
        )

        self.client.force_authenticate(self.teacher)

    def test_create_project(self):
        response = self.client.post(
            reverse('project-list'),
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": self.course.course_id,
                "number_of_groups": 4,
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Updated assertion to use the correct project_id from the response
        created_project_id = response.data.get('project_id')
        self.assertEqual(Project.objects.get(project_id=created_project_id).name, "Test Project 2")
        self.assertEqual(Project.objects.count(), 2)

    def test_retrieve_project(self):
        response = self.client.get(
            reverse('project-detail', args=[self.project.project_id])
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('name'), self.project.name)

    def test_list_projects(self):
        response = self.client.get(
            reverse('project-list')
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_project(self):
        response = self.client.patch(
            reverse('project-detail', args=[self.project.project_id]),
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Updated Test Project")

    def test_delete_project(self):
        response = self.client.delete(
            reverse('project-detail', args=[self.project.project_id])
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 0)

    def test_partial_update_project(self):
        response = self.client.patch(
            reverse('project-detail', args=[self.project.project_id]),
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Updated Test Project")

    # test with invalid project

    def test_retrieve_invalid_project(self):
        response = self.client.get(
            reverse('project-detail', args=[100])
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_project_invalid_project(self):
        response = self.client.patch(
            reverse('project-detail', args=[100]),
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_project_invalid_project(self):
        response = self.client.delete(
            reverse('project-detail', args=[100])
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
