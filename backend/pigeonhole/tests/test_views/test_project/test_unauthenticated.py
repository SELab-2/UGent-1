from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/projects/'


class ProjectTestUnauthenticated(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student = User.objects.create(
            username="student_username",
            email="test@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
            role=3
        )

        self.course = Course.objects.create(
            name="Test Course",
            description="Test Course Description",
        )

        self.student.course.set([self.course])

        self.project = Project.objects.create(
            name="Test Project",
            course_id=self.course
        )

    def test_create_project_unauthenticated(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.count(), 1)

    def test_retrieve_project_unauthenticated(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_projects_unauthenticated(self):
        response = self.client.get(
            API_ENDPOINT
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_project_unauthenticated(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.project.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_project_unauthenticated(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update_project_unauthenticated(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.project.project_id}/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # test with invalid project

    def test_retrieve_invalid_project_unauthenticated(self):
        response = self.client.get(
            API_ENDPOINT + '100/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_invalid_project_unauthenticated(self):
        response = self.client.patch(
            API_ENDPOINT + '100/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_invalid_project_unauthenticated(self):
        response = self.client.delete(
            API_ENDPOINT + '100/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update_invalid_project_unauthenticated(self):
        response = self.client.patch(
            API_ENDPOINT + '100/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
