import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/projects/'


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
            API_ENDPOINT,
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": self.course.course_id,
                "number_of_groups": 4,
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)
        self.assertEqual(Group.objects.count(), 4)
        new_project = Project.objects.get(name="Test Project 2")
        self.assertEqual(new_project.name, "Test Project 2")

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
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        content_json = json.loads(response.content.decode("utf-8"))
        self.assertEqual(content_json["count"], 1)

    def test_update_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.project.project_id}/',
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
            API_ENDPOINT + f'{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 0)

    def test_partial_update_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.project.project_id}/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Updated Test Project")

    def test_retrieve_invalid_project(self):
        response = self.client.get(
            API_ENDPOINT + '100/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_invalid_project(self):
        response = self.client.patch(
            API_ENDPOINT + '100/',
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
            API_ENDPOINT + '100/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_invalid_project(self):
        response = self.client.delete(
            API_ENDPOINT + '100/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def get_groups_of_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.project.project_id}/get_groups/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        content_json = json.loads(response.content.decode("utf-8"))
        self.assertEqual(content_json["count"], 0)
