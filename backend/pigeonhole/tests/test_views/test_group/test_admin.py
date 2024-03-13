from unittest import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/groups/'


class GroupTestAdminTeacher(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.admin = User.objects.create(
            username="admin_username",
            email="test@gmail.com",
            first_name="Test1",
            last_name="Test2",
            role=1
        )

        self.course = Course.objects.create(
            name="Test Course",
            description="Test Course Description",
        )

        self.admin.course.set([self.course])

        self.client.force_authenticate(self.admin)

    def test_admin_create_group(self):
        response = self.client.post(
            API_ENDPOINT + f'{self.course.course_id}/projects/',
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": self.course.course_id,
                "number_of_groups": 4,
            },
            format='json'
        )
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # self.assertEqual(Group.objects.count(), 4)
        # new_group = Group.objects.get(name="Test Project 2")
        # self.assertEqual(new_project.name, "Test Project 2")

    def test_retreive_group(self):
        response = self.client.get(
            # API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/groups/{}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('name'), self.project.name)
