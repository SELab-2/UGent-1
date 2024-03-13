import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/courses/'


class CourseTestStudent(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a regular user (teacher)
        self.teacher = User.objects.create_user(
            username="teacher",
            email="teacher@gmail.com",
            first_name="teacher",
            last_name="teacher"
        )

        self.course_data = {
            'name': 'Test Course',
            'description': 'This is a test course.'
        }

        self.course = Course.objects.create(**self.course_data)

        # Provide a value for the "number" field when creating the Student instance
        self.student = User.objects.create(
            username="student",
            email="student@gmail.com",
            first_name="student",
            last_name="student",
            role=3
        )
        self.student.course.set([self.course])

        # Authenticate the test client with the regular user
        self.client.force_authenticate(user=self.student)

    def test_create_course(self):
        response = self.client.post(API_ENDPOINT, self.course_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Course.objects.count(), 1)

    def test_update_course(self):
        updated_data = {
            'name': 'Updated Course',
            'description': 'This course has been updated.'
        }
        response = self.client.put(f'{API_ENDPOINT}{self.course.course_id}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.course.refresh_from_db()
        self.assertNotEqual(self.course.name, updated_data['name'])
        self.assertNotEqual(self.course.description, updated_data['description'])

    def test_delete_course(self):
        response = self.client.delete(f'{API_ENDPOINT}{self.course.course_id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Course.objects.count(), 1)

    def test_list_courses(self):
        response = self.client.get(API_ENDPOINT)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        content_json = json.loads(response.content.decode("utf-8"))
        self.assertEqual(content_json["count"], 1)
