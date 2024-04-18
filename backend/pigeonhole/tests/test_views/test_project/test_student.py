import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/projects/'


class ProjectTestStudent(TestCase):
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

        self.course_not_of_student = Course.objects.create(
            name="Test Course 2",
        )

        self.student.course.set([self.course])

        self.invisible_project = Project.objects.create(
            name="Test Project",
            course_id=self.course,
            deadline="2021-12-12 12:12:12",
        )

        self.visible_project = Project.objects.create(
            name="Test Project 2",
            course_id=self.course,
            visible=True,
            deadline="2021-12-12 12:12:12",
        )

        self.project_not_of_student = Project.objects.create(
            name="Test Project",
            course_id=self.course_not_of_student,
            deadline="2021-12-12 12:12:12",
        )

        self.client.force_authenticate(self.student)

    def test_create_project(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": self.course.course_id,
                "deadline": "2021-12-12 12:12:12",
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.count(), 3)

    def test_retrieve_visible_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.visible_project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Test Project 2")

    def test_retrieve_invisible_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.invisible_project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_projects(self):
        response = self.client.get(
            API_ENDPOINT
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(len(response.data), 1)

    def test_update_visible_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.visible_project.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.get(project_id=self.visible_project.project_id).name, "Test Project 2")

    def test_update_invisible_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.invisible_project.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.get(project_id=self.invisible_project.project_id).name, "Test Project")

    def test_delete_visible_project(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.visible_project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.count(), 3)

    def test_delete_invisible_project(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.invisible_project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.count(), 3)

    def test_partial_update_visible_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.visible_project.project_id}/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.get(project_id=self.visible_project.project_id).name, "Test Project 2")

    def test_partial_update_invisible_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.invisible_project.project_id}/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.get(project_id=self.invisible_project.project_id).name, "Test Project")

    # tests with a course not of the student

    def test_create_project_course_not_of_student(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": self.course_not_of_student.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.count(), 3)

    def test_retrieve_project_course_not_of_student(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.project_not_of_student.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_projects_course_not_of_student(self):
        response = self.client.get(
            API_ENDPOINT
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_project_course_not_of_student(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.invisible_project.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course_not_of_student.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.get(project_id=self.invisible_project.project_id).name, "Test Project")

    def test_retrieve_invalid_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.invisible_project.project_id}6165498/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_invalid_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.invisible_project.project_id}6841684/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_invalid_project(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.invisible_project.project_id}681854/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def get_groups_of_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.project.project_id}/get_groups/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        content_json = json.loads(response.content.decode("utf-8"))
        self.assertEqual(content_json["count"], 0)
