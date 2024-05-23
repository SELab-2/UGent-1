from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.submissions.models import Submissions
from backend.pigeonhole.apps.users.models import User

from django.core.files.uploadedfile import SimpleUploadedFile

API_ENDPOINT = "/submissions/"


class SubmissionTestStudent(TestCase):
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

        self.project_1 = Project.objects.create(
            name="Test Project",
            course_id=self.course,
            deadline="2025-12-12 12:12:12",
            file_structure="+extra/verslag.pdf",
            test_docker_image="test-always-succeed",
        )

        self.project_2 = Project.objects.create(
            name="Test Project",
            course_id=self.course,
            deadline="2025-12-12 12:12:12",
            file_structure="-extra/verslag.pdf",
            test_docker_image="test-always-succeed",
        )

        self.project_3 = Project.objects.create(
            name="Test Project",
            course_id=self.course,
            deadline="2025-12-12 12:12:12",
            file_structure="+src/*.py",
            test_docker_image="test-always-succeed",
        )

        self.project_4 = Project.objects.create(
            name="Test Project",
            course_id=self.course,
            deadline="2025-12-12 12:12:12",
            file_structure="-src/*.py",
            test_docker_image="test-always-succeed",
        )

        self.project_5 = Project.objects.create(
            name="Test Project",
            course_id=self.course,
            deadline="2025-12-12 12:12:12",
            file_structure="*.sh",
            test_docker_image="test-always-succeed",
        )

        self.group_1 = Group.objects.create(group_nr=1, project_id=self.project_1)
        self.group_2 = Group.objects.create(group_nr=1, project_id=self.project_2)
        self.group_3 = Group.objects.create(group_nr=1, project_id=self.project_3)
        self.group_4 = Group.objects.create(group_nr=1, project_id=self.project_4)

        self.group_not_of_student = Group.objects.create(
            group_nr=2, project_id=self.project_1
        )

        self.group_1.user.set([self.student])
        self.group_2.user.set([self.student])
        self.group_3.user.set([self.student])
        self.group_4.user.set([self.student])

        self.submission = Submissions.objects.create(
            group_id=self.group_1, file_urls="file_urls"
        )

        self.submission_not_of_student = Submissions.objects.create(
            group_id=self.group_not_of_student, file_urls="file_urls"
        )

        self.client.force_authenticate(self.student)

    def test_can_create_submission_without(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "group_id": self.group_1.group_id,
                "file_urls": ""
            },
            format='multipart',
        )
        self.assertEqual(1, response.data['success'])
        self.assertEqual("extra/verslag.pdf", response.data[0][0])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_can_create_submission_withfile(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "group_id": self.group_1.group_id,
                "file_urls": "extra/verslag.pdf"
            },
            format='multipart',
        )
        self.assertEqual(0, response.data['success'])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_can_create_submission_without_forbidden(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "group_id": self.group_2.group_id,
                "file_urls": ""
            },
            format='multipart',
        )
        self.assertEqual(0, response.data['success'])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_can_create_submission_with_forbidden(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "group_id": self.group_2.group_id,
                "file_urls": "extra/verslag.pdf"
            },
            format='multipart',
        )
        self.assertEqual(1, response.data['success'])
        self.assertIn("extra/verslag.pdf", response.data[2])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_can_create_submission_without_wildcard(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "group_id": self.group_3.group_id,
                "file_urls": "src/main.jar, src/test.dockerfile"
            },
            format='multipart',
        )
        self.assertEqual(1, response.data['success'])
        self.assertIn("src/*.py", response.data[0])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_can_create_submission_with_wildcard(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "group_id": self.group_3.group_id,
                "file_urls": "src/main.py"
            }
        )
        self.assertEqual(0, response.data['success'])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_can_create_submission_without_forbidden_wildcard(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "group_id": self.group_4.group_id,
                "file_urls": "src/main.jar, src/test.dockerfile"
            }
        )
        self.assertEqual(0, response.data['success'])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    #
    def test_can_create_submission_with_forbidden_wildcard(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "group_id": self.group_4.group_id,
                "file_urls": "src/main.py"
            }
        )
        self.assertEqual(1, response.data['success'])
        self.assertIn("src/*.py", response.data[2])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_cant_create_invalid_submission(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "file_urls": "",
                "group_id": 489454134561
            }
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
                "group_id": self.group_1.group_id,
                "file_urls": "file_urls",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.patch(
            API_ENDPOINT + str(self.submission.submission_id) + "/",
            {
                "group_id": self.group_1.group_id,
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
                    "group_id": self.group_1.group_id,
                    "file_urls": "file_urls",
                },
            )

            self.client.patch(
                API_ENDPOINT + "4563153/",
                {
                    "group_id": self.group_1.group_id,
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

    # test advanced evaluation

    def test_helloworld(self):
        main_file = SimpleUploadedFile(
            'main.sh',
            "echo hello world.".encode('utf-8'),
            content_type="text/plain"
        )
        main_file.seek(0)

        response = self.client.post(
            API_ENDPOINT,
            {
                "group_id": self.group_1.group_id,
                "file_urls": "main.sh",
                "main.sh": main_file
            },
            format='multipart',
        )

        self.assertEqual(1, response.data['success'])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # TODO: check status and output
