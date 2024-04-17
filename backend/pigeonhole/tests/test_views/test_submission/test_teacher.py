from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.submissions.models import Submissions
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/submissions/'


class SubmissionTestTeacher(TestCase):
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
            course_id=self.course,
            deadline="2021-12-12 12:12:12",
        )

        self.project_not_of_teacher = Project.objects.create(
            name="Test Project 2",
            course_id=self.course_not_of_teacher,
            deadline="2021-12-12 12:12:12",
        )

        self.group_not_of_teacher = Group.objects.create(
            group_nr=2,
            project_id=self.project_not_of_teacher,
        )

        self.group = Group.objects.create(
            group_nr=1,
            project_id=self.project
        )

        self.submission = Submissions.objects.create(
            group_id=self.group,
            file_urls='["test_file.txt"]'
        )

        self.submission_not_of_teacher = Submissions.objects.create(
            group_id=self.group_not_of_teacher,
            file_urls='["test_file.txt"]'
        )

        self.client.force_authenticate(self.teacher)

    def test_cant_create_submission(self):
        test_file = SimpleUploadedFile("test_file.txt", b"file_content")
        response = self.client.post(API_ENDPOINT,
                                    {
                                        "file": test_file,
                                        "group_id": self.group
                                    }
                                    )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cant_create_invalid_submission(self):
        test_file = SimpleUploadedFile("test_file.txt", b"file_content")
        response = self.client.post(API_ENDPOINT,
                                    {
                                        "file": test_file,
                                        "group_id": 489454134561
                                    }
                                    )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_submissions(self):
        response = self.client.get(
            API_ENDPOINT + str(self.submission.submission_id) + '/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("submission_id"), self.submission.submission_id)

    def test_retriev_invalid_submissions(self):
        with self.assertRaises(Submissions.DoesNotExist):
            self.client.get(
                API_ENDPOINT + str(489454134561) + '/'
            )

    def test_cant_retreive_submissions_of_different_course(self):
        response = self.client.get(
            API_ENDPOINT + str(self.submission_not_of_teacher.submission_id) + '/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cant_update_submission(self):
        response = self.client.put(
            API_ENDPOINT + str(self.submission.submission_id) + '/',
            {
                "group_id": self.group.group_id,
                "file": SimpleUploadedFile("test_file.txt", b"file_content")
            },
        )
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        response = self.client.patch(
            API_ENDPOINT + str(self.submission.submission_id) + '/',
            {
                "group_id": self.group.group_id,
                "file": SimpleUploadedFile("test_file.txt", b"file_content")
            },
        )
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_cant_update_invalid_submission(self):
        with self.assertRaises(Submissions.DoesNotExist):
            self.client.put(
                API_ENDPOINT + '4561313516/',
                {
                    "group_id": self.group.group_id,
                    "file": SimpleUploadedFile("test_file.txt", b"file_content")
                },
            )

            self.client.patch(
                API_ENDPOINT + '4563153/',
                {
                    "group_id": self.group.group_id,
                    "file": SimpleUploadedFile("test_file.txt", b"file_content")
                },
            )

    def test_cant_delete_submission(self):
        response = self.client.delete(
            API_ENDPOINT + str(self.submission.submission_id) + '/'
        )
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_cant_delete_invalid_submission(self):
        with self.assertRaises(Submissions.DoesNotExist):
            self.client.delete(
                API_ENDPOINT + '4561313516/',
            )
            self.client.delete(
                API_ENDPOINT + '4563153/',
            )
