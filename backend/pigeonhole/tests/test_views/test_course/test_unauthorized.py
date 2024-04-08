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

        self.course_not_of_user = Course.objects.create(name="Not of user",
                                                        description="This is not of the user")

    def test_create_course(self):
        response = self.client.post(API_ENDPOINT, self.course_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Course.objects.count(), 2)

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

    def test_partial_update_course(self):
        response = self.client.patch(f'{API_ENDPOINT}{self.course.course_id}/', {'name': 'wrong data'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.course.refresh_from_db()
        self.assertNotEqual(self.course.name, 'Updated Course')

    def test_delete_course(self):
        response = self.client.delete(f'{API_ENDPOINT}{self.course.course_id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Course.objects.count(), 2)

    def test_retrieve_course(self):
        response = self.client.get(f'{API_ENDPOINT}{self.course.course_id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_courses(self):
        response = self.client.get(API_ENDPOINT)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_projects(self):
        response = self.client.get(f'{API_ENDPOINT}{self.course.course_id}/get_projects/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # test with invalid course

    def get_projects_invalid_course(self):
        response = self.client.get(f'{API_ENDPOINT}100/projects/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def get_projects_invalid_course_not_exist(self):
        response = self.client.get(f'{API_ENDPOINT}100/projects/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_course_not_exist(self):
        updated_data = {
            'name': 'Updated Course',
            'description': 'This course has been updated.'
        }
        response = self.client.put(f'{API_ENDPOINT}100/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update_course_not_exist(self):
        response = self.client.patch(f'{API_ENDPOINT}100/', {'name': 'Updated Course'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_selected_courses(self):
        response = self.client.get(f'{API_ENDPOINT}get_selected_courses/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_join_course(self):
        response = self.client.post(f'{API_ENDPOINT}{self.course_not_of_user.course_id}/join_course/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_join_course_token(self):
        response = self.client.post(
            f'{API_ENDPOINT}{self.course_not_of_user.course_id}/join_course_with_token/TokenHere/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_join_course_not_exist(self):
        response = self.client.post(f'{API_ENDPOINT}56152/join_course/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_teachers(self):
        response = self.client.get(f'{API_ENDPOINT}{self.course.course_id}/get_teachers/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
