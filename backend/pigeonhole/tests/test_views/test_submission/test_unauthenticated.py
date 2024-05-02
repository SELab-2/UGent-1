from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.submissions.models import Submissions
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = "/submissions/"


class SubmissionTestTeacher(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.student = User.objects.create(
            username="student_username1",
            email="test1@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
            role=3,
        )

        self.course = Course.objects.create(
            name="Test Course",
            description="Test Course Description",
        )

        self.student.course.set([self.course])

        self.project = Project.objects.create(
            name="Test Project",
            course_id=self.course,
            deadline="2021-12-12 12:12:12",
        )

        self.group = Group.objects.create(group_nr=1, project_id=self.project)

        self.group_not_of_student = Group.objects.create(
            group_nr=2, project_id=self.project
        )

        self.group.user.set([self.student])

        self.submission = Submissions.objects.create(
            group_id=self.group, file_urls="file_url"
        )

        self.submission_not_of_student = Submissions.objects.create(
            group_id=self.group_not_of_student, file_urls="file_url"
        )

    def test_cant_create_submission(self):
        response = self.client.post(
            API_ENDPOINT, {"file_urls": "file_urls", "group_id": self.group.group_id}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cant_create_invalid_submission(self):
        response = self.client.post(
            API_ENDPOINT, {"file_urls": "file_urls", "group_id": 489454134561}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_submissions(self):
        response = self.client.get(
            API_ENDPOINT + str(self.submission.submission_id) + "/"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cant_retreive_submissions_of_different_course(self):
        response = self.client.get(
            API_ENDPOINT + str(self.submission_not_of_student.submission_id) + "/"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cant_update_submission(self):
        response = self.client.put(
            API_ENDPOINT + str(self.submission.submission_id) + "/",
            {
                "group_id": self.group.group_id,
                "file_urls": "file_urls",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(
            API_ENDPOINT + str(self.submission.submission_id) + "/",
            {
                "group_id": self.group.group_id,
                "file_urls": "file_urls",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cant_update_other_submission(self):
        response = self.client.put(
            API_ENDPOINT + str(self.submission_not_of_student.submission_id) + "/",
            {
                "group_id": self.group_not_of_student.group_id,
                "file_urls": "file_urls",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(
            API_ENDPOINT + str(self.submission_not_of_student.submission_id) + "/",
            {
                "group_id": self.group_not_of_student.group_id,
                "file_urls": "file_urls",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cant_delete_submission(self):
        response = self.client.delete(
            API_ENDPOINT + str(self.submission.submission_id) + "/"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cant_delete_other_submission(self):
        response = self.client.delete(
            API_ENDPOINT + str(self.submission_not_of_student.submission_id) + "/"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
