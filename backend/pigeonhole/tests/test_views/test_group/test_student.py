from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/groups/'


class GroupTestStudent(TestCase):
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
        self.group2.user.add(self.student)

        self.group_not_visible = Group.objects.create(
            group_id=2,
            group_nr=3,
            final_score=0,
            project_id=self.project,
            feedback="Test Feedback",
            visible=False,
        )

        self.client.force_authenticate(self.student)

    def test_student_create_group(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "name": "Test Group 1",
                "description": "Test Group 1 Description",
                "project_id": self.project.project_id,
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_group(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.group2.group_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # test whether feedback and final_score are visbile
        self.assertEqual(response.data['feedback'], "Test Feedback")
        self.assertEqual(response.data['final_score'], 0)

    def test_score_not_visible_in_other_group(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.group1.group_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # test whether feedback and final_score are not vin response
        self.assertNotIn('feedback', response.data)
        self.assertNotIn('final_score', response.data)

    def test_list_groups(self):
        response = self.client.get(
            API_ENDPOINT
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_group(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.group1.group_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Group.objects.count(), 3)  # Count should remain the same

    def test_delete_invalid_group(self):
        response = self.client.delete(
            API_ENDPOINT + '999/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_submissions(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.group1.group_id}/get_submissions/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_leave_group(self):
        response = self.client.post(
            API_ENDPOINT + f'{self.group2.group_id}/leave/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_leave_group_not_joined(self):
        response = self.client.post(
            API_ENDPOINT + f'{self.group_not_visible.group_id}/leave/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update_group(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.group1.group_id}/',
            {'feedback': 'Updated Feedback'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update_invalid_group(self):
        response = self.client.patch(
            API_ENDPOINT + '999/',
            {'feedback': 'Updated Feedback'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_invalid_group(self):
        response = self.client.get(
            API_ENDPOINT + '9999/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_leave_and_join_group(self):
        response = self.client.post(
            API_ENDPOINT + f'{self.group2.group_id}/leave/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.group2.user.count(), 0)
        response = self.client.post(
            API_ENDPOINT + f'{self.group2.group_id}/join/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.group2.user.count(), 1)
