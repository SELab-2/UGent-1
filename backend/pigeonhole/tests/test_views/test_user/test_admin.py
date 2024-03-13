from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User
from backend.pigeonhole.apps.groups.models import Group


class ProjectTestAdminTeacher(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin = User.objects.create(
            username="admin_username",
            email="test@gmail.com",
            first_name="User1",
            last_name="User1",
            role=1
        )

        self.client.force_authenticate(self.admin)

    def test_create_user(self):
        response = self.client.post(
            '/users/',
            {
                "id": 1,
                "username": "admin_username",
                "email": "test2@gmail.com",
                "first_name": "User2",
                "last_name": "User2",
                "role": 3
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)
        new_user = User.objects.get(name="User2")
        self.assertEqual(new_user.name, "User2")

    def test_retrieve_user(self):
        response = self.client.get(
           f'/users/{self.admin.id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('username'), "User1")

    def test_list_users(self):
        response = self.client.get(
            '/users/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_update_user(self):
        response = self.client.put(
            f'/users/2/',
            {
                "username": "admin_username",
                "email": "test2@gmail.com",
                "first_name": "User2",
                "last_name": "User2",
                "role": 2
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.get(id=2).role, 2)

    def test_delete_user(self):
        response = self.client.delete(
            '/users/2/'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 1)


    # def test_partial_update_user(self):
    #
    #
    # def test_create_project_invalid_user(self):
    #
    #
    # def test_update_project_invalid_user(self):
    #
    #
    # def test_delete_project_invalid_user(self):
    #
    #
    # def test_partial_update_project_invalid_user(self):
    #
    #
    # def test_retrieve_project_invalid_user(self):
    #
    #
    # def test_list_projects_invalid_user(self):
    #
    #
    # def test_retrieve_invalid_user(self):
    #
    #
    # def test_update_invalid_project(self):
    #     response = self.client.patch(
    #         API_ENDPOINT + f'{self.course.course_id}/projects/100/',
    #         {
    #             "name": "Updated Test Project",
    #             "description": "Updated Test Project Description",
    #             "course_id": self.course.course_id
    #         },
    #         format='json'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    #
    # def test_partial_update_invalid_project(self):
    #     response = self.client.patch(
    #         API_ENDPOINT + f'{self.course.course_id}/projects/100/',
    #         {
    #             "name": "Updated Test Project"
    #         },
    #         format='json'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    #
    # def test_delete_invalid_project(self):
    #     response = self.client.delete(
    #         API_ENDPOINT + f'{self.course.course_id}/projects/100/'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
