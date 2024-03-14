import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.users.models import User
from backend.pigeonhole.apps.projects.models import Project

API_ENDPOINT = '/courses/'


class CourseTestTeacher(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.course_data = {
            'name': 'Test Course',
            'description': 'This is a test course.'
        }

        self.course = Course.objects.create(**self.course_data)

        self.course_not_of_teacher = Course.objects.create(name="Not of Teacher",
                                                           description="This is not of the teacher")

        self.teacher = User.objects.create(
            username="teacher_username",
            email="teacher@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
            role=2
        )

        self.project = Project.objects.create(
            name="Test Project",
            course_id=self.course
        )

        self.teacher.course.set([self.course])

        self.client.force_authenticate(user=self.teacher)

    def test_create_course(self):
        response = self.client.post(API_ENDPOINT, self.course_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Course.objects.count(), 3)
        self.assertEqual(self.teacher.course.count(), 2)

    def test_update_course(self):
        updated_data = {
            'name': 'Updated Course',
            'description': 'This course has been updated.'
        }
        response = self.client.put(f'{API_ENDPOINT}{self.course.course_id}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course.refresh_from_db()
        self.assertEqual(self.course.name, updated_data['name'])
        self.assertEqual(self.course.description, updated_data['description'])

    def test_update_course_not_of_teacher(self):
        updated_data = {
            'name': 'Updated Course',
            'description': 'This course has been updated.'
        }
        response = self.client.put(f'{API_ENDPOINT}{self.course_not_of_teacher.course_id}/', updated_data,
                                   format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_course(self):
        response = self.client.delete(f'{API_ENDPOINT}{self.course.course_id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Course.objects.count(), 1)

    def test_delete_course_not_of_teacher(self):
        response = self.client.delete(f'{API_ENDPOINT}{self.course_not_of_teacher.course_id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_courses(self):
        response = self.client.get(API_ENDPOINT)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        content_json = json.loads(response.content.decode("utf-8"))
        self.assertEqual(content_json["count"], 2)

    def test_retrieve_course(self):
        response = self.client.get(f'{API_ENDPOINT}{self.course.course_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.course.name)
        self.assertEqual(response.data['description'], self.course.description)

    def test_retrieve_course_not_exist(self):
        response = self.client.get(f'{API_ENDPOINT}100/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def get_projects(self):
        response = self.client.get(f'{API_ENDPOINT}{self.course.course_id}/projects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.project.name)
        self.assertEqual(response.data[0]['course_id'], self.course.course_id)

    def get_projects_of_course_not_of_teacher(self):
        response = self.client.get(f'{API_ENDPOINT}{self.course_not_of_teacher.course_id}/projects/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(len(response.data), 0)
        self.assertEqual(response.data, [])
