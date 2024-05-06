import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/projects/'


class ProjectTestStudent(TestCase):
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
            name="Test Project",
            course_id=self.course_not_of_teacher,
            deadline="2021-12-12 12:12:12",
        )

        self.client.force_authenticate(self.teacher)

        self.student1 = User.objects.create(
            username="student_username1",
            email="test1@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
            role=3
        )
        self.student1.course.set([self.course])

        self.student2 = User.objects.create(
            username="student_username2",
            email="test2@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
            role=3
        )
        self.student2.course.set([self.course])

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
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 3)

    def test_retrieve_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('name'), self.project.name)

    def test_list_projects(self):
        response = self.client.get(
            API_ENDPOINT
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(len(response.data), 1)

    def test_update_project(self):
        response = self.client.put(
            API_ENDPOINT + f'{self.project.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id,
                "deadline": "2021-12-12 12:12:12",
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_project(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_retrieve_invisible_project(self):
        invisible_project = Project.objects.create(
            name="Test Project",
            course_id=self.course,
            visible=False,
            deadline="2021-12-12 12:12:12",
        )
        response = self.client.get(
            API_ENDPOINT + f'{invisible_project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # test with invalid project

    def test_retrieve_invalid_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.project.project_id}5654168944/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_project_invalid_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.project.project_id}5615491/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_project_invalid_project(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.project.project_id}651689/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # test with project not of teacher

    def test_retrieve_project_not_of_teacher(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.project_not_of_teacher.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_project_not_of_teacher(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.project_not_of_teacher.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_project_not_of_teacher(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.project_not_of_teacher.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def get_groups_of_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.project.project_id}/get_groups/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        content_json = json.loads(response.content.decode("utf-8"))
        self.assertEqual(content_json["count"], 0)

    def test_create_individual_project(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "name": "Test Individual Project",
                "description": "Test Project 2 Description",
                "course_id": self.course.course_id,
                "deadline": "2021-12-12 12:12:12",
                "group_size": 1
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        project = Project.objects.get(name="Test Individual Project")
        groups = Group.objects.filter(project_id=project)
        students = User.objects.filter(course=self.course, role=3)
        self.assertEqual(len(groups), len(students))
        for group in groups:
            self.assertEqual(group.user.count(), 1)
        self.assertTrue(groups[0].user.first() in students)
        self.assertTrue(groups[1].user.first() in students)
        self.assertFalse(groups[0].user.first() == groups[1].user.first())
