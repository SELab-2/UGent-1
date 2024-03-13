from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/projects/'


class ProjectTestStudent(TestCase):
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
        
        self.project_not_of_teacher = Project.objects.create(
            name="Test Project",
            course_id=self.course_not_of_teacher
        )

        self.client.force_authenticate(self.teacher)

    def test_create_project(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 3)

    def test_retrieve_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('name'), self.project.name)

    def test_list_projects(self):
        response = self.client.get(
            API_ENDPOINT
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(len(response.data), 1)

    def test_update_project(self):
        response = self.client.put(
            API_ENDPOINT + f'{self.project.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_project(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_retrieve_invisible_project(self):
        invisible_project = Project.objects.create(
            name="Test Project",
            course_id=self.course,
            visible=False
        )
        response = self.client.get(
            API_ENDPOINT + f'{invisible_project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    # test with invalid project

    def test_retrieve_invalid_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.project.project_id}5654168944/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_project_invalid_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.project.project_id}5615491/',
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
            API_ENDPOINT + f'{self.project.project_id}651689/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # test with project not of teacher
    
    def test_retrieve_project_not_of_teacher(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.project_not_of_teacher.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_update_project_not_of_teacher(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.project_not_of_teacher.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_delete_project_not_of_teacher(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.project_not_of_teacher.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_partial_update_project_not_of_teacher(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.project_not_of_teacher.project_id}/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)