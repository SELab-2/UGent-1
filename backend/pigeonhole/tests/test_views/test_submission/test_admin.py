from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.submissions.models import Submissions
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/courses/'


class SubmissionTestAdmin(TestCase):
    def setUp(self):
        self.client = APIClient()

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
            course_id=self.course
        )

        self.group = Group.objects.create(
            group_nr=1,
            project_id=self.project
        )

        self.group.user.set([self.admin])

        self.submission = Submissions.objects.create(
            group_id=self.group,
            file=SimpleUploadedFile("test_file.txt", b"file_content")
        )

        self.client.force_authenticate(self.admin)

    def test_submit_submission(self):
        test_file = SimpleUploadedFile("test_file.txt", b"file_content")
        response = self.client.post(
            API_ENDPOINT + f'submissions/',
            {
                "file": test_file,
                "group_id": self.group.group_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Submissions.objects.count(), 2)
        self.assertEqual(1, 2)

    def test_retrieve_submission(self):
        response = self.client.get(
            API_ENDPOINT + f'submissions/{self.submission.submission_id}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('file'), SimpleUploadedFile("test_file.txt", b"file_content"))

    # def test_list_projects(self):
    #     response = self.client.get(
    #         API_ENDPOINT + f'{self.course.course_id}/projects/'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(len(response.data), 1)
    #
    # def test_update_project(self):
    #     response = self.client.patch(
    #         API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/',
    #         {
    #             "name": "Updated Test Project",
    #             "description": "Updated Test Project Description",
    #             "course_id": self.course.course_id
    #         },
    #         format='json'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Updated Test Project")
    #
    # def test_delete_project(self):
    #     response = self.client.delete(
    #         API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #     self.assertEqual(Project.objects.count(), 0)
    #
    # def test_partial_update_project(self):
    #     response = self.client.patch(
    #         API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/',
    #         {
    #             "name": "Updated Test Project"
    #         },
    #         format='json'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Updated Test Project")
    #
    # # tests with an invalid course
    #
    # def test_create_project_invalid_course(self):
    #     response = self.client.post(
    #         API_ENDPOINT + '100/projects/',
    #         {
    #             "name": "Test Project 2",
    #             "description": "Test Project 2 Description",
    #             "course_id": 100
    #         },
    #         format='json'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    #     self.assertEqual(Project.objects.count(), 1)
    #
    # def test_update_project_invalid_course(self):
    #     response = self.client.patch(
    #         API_ENDPOINT + f'100/projects/{self.project.project_id}/',
    #         {
    #             "name": "Updated Test Project",
    #             "description": "Updated Test Project Description",
    #             "course_id": 100
    #         },
    #         format='json'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    #     self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Test Project")
    #
    # def test_delete_project_invalid_course(self):
    #     response = self.client.delete(
    #         API_ENDPOINT + f'100/projects/{self.project.project_id}/'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    #     self.assertEqual(Project.objects.count(), 1)
    #
    # def test_partial_update_project_invalid_course(self):
    #     response = self.client.patch(
    #         API_ENDPOINT + f'100/projects/{self.project.project_id}/',
    #         {
    #             "name": "Updated Test Project"
    #         },
    #         format='json'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    #     self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Test Project")
    #
    # def test_retrieve_project_invalid_course(self):
    #     response = self.client.get(
    #         API_ENDPOINT + f'100/projects/{self.project.project_id}/'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    #
    # def test_list_projects_invalid_course(self):
    #     response = self.client.get(
    #         API_ENDPOINT + '100/projects/'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    #
    # # test with invalid project
    #
    # def test_retrieve_invalid_project(self):
    #     response = self.client.get(
    #         API_ENDPOINT + f'{self.course.course_id}/projects/100/'
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
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
