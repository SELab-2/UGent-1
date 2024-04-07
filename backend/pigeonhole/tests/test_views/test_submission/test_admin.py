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


class SubmissionTestAdmin(TestCase):
    def setUp(self):
        self.client = APIClient()  # client

        self.admin = User.objects.create(
            username="admin_username1",
            email="test1@gmail.com",
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
            course_id=self.course,
            deadline="2021-12-12 12:12:12",
        )

        self.group = Group.objects.create(
            group_nr=1,
            project_id=self.project
        )

        self.group_not_of_admin = Group.objects.create(
            group_nr=2,
            project_id=self.project
        )

        self.group.user.set([self.admin])

        self.submission = Submissions.objects.create(
            group_id=self.group,
            file=SimpleUploadedFile("test_file.txt", b"file_content")
        )

        self.client.force_authenticate(self.admin)

    def check_setup(self):
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(Course.objects.count(), 1)
        self.assertEqual(Project.objects.count(), 1)
        self.assertEqual(Group.objects.count(), 1)
        self.assertEqual(Submissions.objects.count(), 1)

    def test_submit_submission(self):
        test_file = SimpleUploadedFile("test_file.txt", b"file_content")
        response = self.client.post(API_ENDPOINT,
                                    {
                                        "file": test_file,
                                        "group_id": self.group.group_id
                                    }
                                    )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Submissions.objects.count(), 2)

    def test_submit_submission_in_different_group(self):
        test_file = SimpleUploadedFile("test_file.txt", b"file_content")
        response = self.client.post(API_ENDPOINT,
                                    {
                                        "file": test_file,
                                        "group_id": self.group_not_of_admin.group_id
                                    }
                                    )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Submissions.objects.count(), 2)

    def test_retrieve_submission(self):
        response = self.client.get(
            API_ENDPOINT + str(self.submission.submission_id) + '/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("submission_id"), self.submission.submission_id)

    # tests with an invalid submission

    def test_create_submission_invalid_group(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "group_id": 95955351,
                "file": SimpleUploadedFile("test_file.txt", b"file_content")
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_not_possible(self):
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

    def test_update_not_possible_invalid(self):
        with self.assertRaises(Exception):
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

    def test_delete_submission_not_possible(self):
        response = self.client.delete(
            API_ENDPOINT + str(self.submission.submission_id) + '/'
        )
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_submission_invalid(self):
        with self.assertRaises(Exception):
            self.client.delete(
                API_ENDPOINT + '4563153/'
            )
