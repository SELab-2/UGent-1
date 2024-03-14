from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/groups/'


class GroupTestUnauthorized(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.teacher = User.objects.create(
            username="teacher_username",
            email="teacher@gmail.com",
            first_name="teacher",
            last_name="lastname",
            role=2,
        )

        self.course = Course.objects.create(
            name="Test Course",
            description="Test Course Description",
        )

        self.teacher.course.set([self.course])

        self.project = Project.objects.create(
            name="Test Project",
            course_id=self.course,
            number_of_groups=3,
            group_size=2,
        )

        self.group1 = Group.objects.create(
            group_id=0,
            group_nr=1,
            final_score=0,
            project_id=self.project,
            feedback="Test Feedback",
            visible=True,
        )

        self.group2 = Group.objects.create(
            group_id=1,
            group_nr=2,
            final_score=0,
            project_id=self.project,
            feedback="Test Feedback",
            visible=True,
        )

        self.group_not_visible = Group.objects.create(
            group_id=2,
            group_nr=3,
            final_score=0,
            project_id=self.project,
            feedback="Test Feedback",
            visible=False,
        )

    def test_retrieve_group(self):
        response = self.client.get(API_ENDPOINT + f'{self.group1.group_id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_group(self):
        response = self.client.get(API_ENDPOINT)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_group(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.group1.group_id}/',
            {
                "name": "Updated Test Group",
                "description": "Updated Test Group Description",
                "project_id": self.project.project_id,
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_group(self):
        response = self.client.delete(API_ENDPOINT + f'{self.group1.group_id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update_group(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.group1.group_id}/',
            {
                "name": "Updated Test Group",
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_group_submissions(self):
        response = self.client.get(API_ENDPOINT + f'{self.group1.group_id}/get_submissions/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
