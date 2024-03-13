from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course

API_ENDPOINT = '/courses/'


class CourseTestUnauthorized(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.course_data = {
            'name': 'Test Course',
            'description': 'This is a test course.'
        }

        self.course = Course.objects.create(**self.course_data)

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
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
