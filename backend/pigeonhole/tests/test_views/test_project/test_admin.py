from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/courses/'


class ProjectTestAdminTeacher(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin = User.objects.create(
            username="admin_username",
            email="test@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
            role=1
        )

        self.course = Course.objects.create(
            name="Test Course",
            description="Test Course Description",
        )

        self.admin.course.set([self.course])

        self.project = Project.objects.create(
            name="Test Project",
            course_id=self.course
        )

        self.client.force_authenticate(self.admin)

    def test_create_project(self):
        response = self.client.post(
            API_ENDPOINT + f'{self.course.course_id}/projects/',
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)
        self.assertEqual(Project.objects.get(project_id=2).name, "Test Project 2")

    def test_retrieve_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('name'), self.project.name)

    def test_list_projects(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course.course_id}/projects/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/',
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
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 0)

    def test_partial_update_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Updated Test Project")

    # tests with an invalid course

    def test_create_project_invalid_course(self):
        response = self.client.post(
            API_ENDPOINT + f'100/projects/',
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": 100
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Project.objects.count(), 1)

    def test_update_project_invalid_course(self):
        response = self.client.patch(
            API_ENDPOINT + f'100/projects/{self.project.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": 100
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Test Project")

    def test_delete_project_invalid_course(self):
        response = self.client.delete(
            API_ENDPOINT + f'100/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Project.objects.count(), 1)

    def test_partial_update_project_invalid_course(self):
        response = self.client.patch(
            API_ENDPOINT + f'100/projects/{self.project.project_id}/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Test Project")

    def test_retrieve_project_invalid_course(self):
        response = self.client.get(
            API_ENDPOINT + f'100/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_projects_invalid_course(self):
        response = self.client.get(
            API_ENDPOINT + f'100/projects/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # test with invalid project

    def test_retrieve_invalid_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course.course_id}/projects/100/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_invalid_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course.course_id}/projects/100/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_partial_update_invalid_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course.course_id}/projects/100/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_invalid_project(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.course.course_id}/projects/100/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
