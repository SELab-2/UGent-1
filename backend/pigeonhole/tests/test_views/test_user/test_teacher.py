import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/users/'


class UserTestTeacher(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.teacher = User.objects.create(
            username="user1",
            email="user1@gmail.com",
            first_name="user1",
            last_name="user1",
            role=2,
        )

        self.student = User.objects.create(
            username="user2",
            email="user2@gmail.com",
            first_name="user2",
            last_name="user2",
            role=3,
        )

        self.course = Course.objects.create(name="Test Course", description="This is a test course.")

        self.client.force_authenticate(user=self.teacher)

    def test_create_user(self):
        response = self.client.post(
            API_ENDPOINT,
            {
                "username": "user5",
                "email": "user5@gmail.com",
                "first_name": "user5",
                "last_name": "user5",
                "role": 2,
                "course": [self.course.course_id]
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(User.objects.count(), 2)

    def test_update_self(self):
        updated_data = {
            'username': 'user1',
            'first_name': 'user6',
            'last_name': 'user1',
            'email': 'user1@gmail.com',
            'role': 2,
            'course': [self.course.course_id]
        }
        response = self.client.put(f'{API_ENDPOINT}{self.teacher.id}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], updated_data['first_name'])

    def test_delete_self(self):
        response = self.client.delete(f'{API_ENDPOINT}{self.teacher.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(User.objects.count(), 2)

    def test_update_other(self):
        updated_data = {
            'username': 'user2',
            'first_name': 'user6',
            'last_name': 'user2',
            'email': 'user2@gmail.com',
            'role': 3,
            'course': [self.course.course_id]
        }
        response = self.client.put(f'{API_ENDPOINT}{self.student.id}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_other(self):
        response = self.client.delete(f'{API_ENDPOINT}{self.student.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(User.objects.count(), 2)

    def test_list_users(self):
        response = self.client.get(API_ENDPOINT)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        content_json = json.loads(response.content.decode("utf-8"))
        self.assertEqual(content_json["count"], 2)

    def test_retrieve_user(self):
        response = self.client.get(f'{API_ENDPOINT}{self.teacher.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], self.teacher.first_name)

    def test_add_course_to_user(self):
        response = self.client.post(
            f"{API_ENDPOINT}{self.student.id}/add_course_to_user/",
            {"course_id": self.course.course_id},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.course.count(), 1)
        self.assertEqual(self.student.course.first().course_id, self.course.course_id)

    def test_remove_course_from_user(self):
        self.student.course.add(self.course.course_id)
        response = self.client.post(
            f"{API_ENDPOINT}{self.student.id}/remove_course_from_user/",
            {"course_id": self.course.course_id},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.course.count(), 0)
