import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User

API_ENDPOINT = '/courses/'


class CourseTestAdminTeacher(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.course_data = {
            'name': 'Test Course',
            'description': 'This is a test course.'
        }

        self.course_not_of_admin = Course.objects.create(name="Not of Admin",
                                                         description="This is not of the admin")
        self.course_not_of_admin2 = Course.objects.create(name="Not of Admin 2",
                                                          description="This is not of the admin 2")

        self.course = Course.objects.create(**self.course_data)

        # Create a regular user (teacher)
        self.admin = User.objects.create(
            username="teacher_username",
            email="test@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
            role=1,
        )

        self.project = Project.objects.create(
            name="Test Project",
            course_id=self.course
        )

        self.admin.course.set([self.course])
        self.client.force_authenticate(user=self.admin)

    def test_create_course(self):
        response = self.client.post(API_ENDPOINT, self.course_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Course.objects.count(), 4)
        self.assertEqual(self.admin.course.count(), 2)

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
        response = self.client.put(f'{API_ENDPOINT}{self.course_not_of_admin.course_id}/', updated_data,
                                   format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course_not_of_admin.refresh_from_db()
        self.assertEqual(self.course_not_of_admin.name, updated_data['name'])
        self.assertEqual(self.course_not_of_admin.description, updated_data['description'])

    def test_partial_update_course(self):
        response = self.client.patch(f'{API_ENDPOINT}{self.course.course_id}/', {'name': 'Updated Course'},
                                     format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course.refresh_from_db()
        self.assertEqual(self.course.name, 'Updated Course')

    def test_delete_course(self):
        response = self.client.delete(f'{API_ENDPOINT}{self.course.course_id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Course.objects.count(), 2)

    def test_delete_course_not_of_teacher(self):
        response = self.client.delete(f'{API_ENDPOINT}{self.course_not_of_admin.course_id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Course.objects.count(), 2)

    def test_retrieve_course(self):
        response = self.client.get(f'{API_ENDPOINT}{self.course.course_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.course.name)
        self.assertEqual(response.data['description'], self.course.description)

    def test_list_courses(self):
        response = self.client.get(API_ENDPOINT)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        content_json = json.loads(response.content.decode("utf-8"))
        self.assertEqual(content_json["count"], 3)

    def test_retrieve_course_not_exist(self):
        response = self.client.get(f'{API_ENDPOINT}100/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_course_not_exist(self):
        response = self.client.delete(f'{API_ENDPOINT}100/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def get_projects(self):
        response = self.client.get(f'{API_ENDPOINT}{self.course.course_id}/projects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.project.name)
        self.assertEqual(response.data[0]['course_id'], self.course.course_id)

    # test with invalid course

    def get_projects_invalid_course(self):
        response = self.client.get(f'{API_ENDPOINT}100/projects/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def get_projects_invalid_course_not_exist(self):
        response = self.client.get(f'{API_ENDPOINT}100/projects/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_course_not_exist(self):
        updated_data = {
            'name': 'Updated Course',
            'description': 'This course has been updated.'
        }
        response = self.client.put(f'{API_ENDPOINT}100/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_partial_update_course_not_exists(self):
        response = self.client.patch(f'{API_ENDPOINT}100/', {'name': 'Updated Course'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_selected_courses(self):
        response = self.client.get(f'{API_ENDPOINT}get_selected_courses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.admin.course.count(), 1)

    def test_join_course(self):
        self.assertEqual(self.admin.course.count(), 1)
        response = self.client.post(f'{API_ENDPOINT}{self.course_not_of_admin2.course_id}/join_course/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.admin.course.count(), 2)

    def test_join_course_not_exist(self):
        response = self.client.post(f'{API_ENDPOINT}56152/join_course/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_leave_course(self):
        self.client.post(f'{API_ENDPOINT}{self.course_not_of_admin2.course_id}/join_course/')
        self.assertEqual(self.admin.course.count(), 2)
        response = self.client.post(f'{API_ENDPOINT}{self.course_not_of_admin2.course_id}/leave_course/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.admin.course.count(), 1)

    def test_leave_course_not_joined(self):
        response = self.client.post(f'{API_ENDPOINT}{self.course_not_of_admin2.course_id}/leave_course/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.admin.course.count(), 1)

    def test_leave_course_not_exist(self):
        response = self.client.post(f'{API_ENDPOINT}56152/leave_course/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
