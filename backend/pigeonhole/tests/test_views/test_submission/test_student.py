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
            deadline="2025-12-12 12:12:12",
        )

        self.group = Group.objects.create(group_nr=1, project_id=self.project)

        self.group_not_of_student = Group.objects.create(
            group_nr=2, project_id=self.project
        )

        self.group.user.set([self.student])

        self.submission = Submissions.objects.create(
            group_id=self.group, file_urls="file_urls"
        )

        self.submission_not_of_student = Submissions.objects.create(
            group_id=self.group_not_of_student, file_urls="file_urls"
        )

        self.client.force_authenticate(self.student)

    def test_can_create_submission(self):
        response = self.client.post(API_ENDPOINT, {"group_id": self.group.group_id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_cant_create_invalid_submission(self):
        response = self.client.post(
            API_ENDPOINT, {"file_urls": "file_urls", "group_id": 489454134561}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_submissions(self):
        response = self.client.get(
            API_ENDPOINT + str(self.submission.submission_id) + "/"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data.get("submission_id"), self.submission.submission_id
        )

    def test_retriev_invalid_submissions(self):
        with self.assertRaises(Submissions.DoesNotExist):
            self.client.get(API_ENDPOINT + str(489454134561) + "/")

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

    def test_cant_update_invalid_submission(self):
        with self.assertRaises(Submissions.DoesNotExist):
            self.client.put(
                API_ENDPOINT + "4561313516/",
                {
                    "group_id": self.group.group_id,
                    "file_urls": "file_urls",
                },
            )

            self.client.patch(
                API_ENDPOINT + "4563153/",
                {
                    "group_id": self.group.group_id,
                    "file_urls": "file_urls",
                },
            )

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

    def test_cant_delete_invalid_submission(self):
        with self.assertRaises(Submissions.DoesNotExist):
            self.client.delete(
                API_ENDPOINT + "4561313516/",
            )
            self.client.delete(
                API_ENDPOINT + "4563153/",
            )
