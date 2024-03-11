from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from backend.pigeonhole.apps.users.models import User, Teacher, Student
from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project

API_ENDPOINT = '/courses/'  # Updated the API_ENDPOINT


class ProjectTestAdminTeacher(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="teacher_username",
            email="test@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
        )

        self.teacher = Teacher.objects.create(
            id=self.user,
            is_admin=True
        )

        self.course = Course.objects.create(
            name="Test Course",
            description="Test Course Description",
        )

        self.teacher.course.set([self.course])

        self.project = Project.objects.create(
            name="Test Project",
            course_id=self.course
        )

        self.client.force_authenticate(self.user)

    def test_create_project(self):
        response = self.client.post(
            API_ENDPOINT + f'{self.course.course_id}/projects/',
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)
        self.assertEqual(Project.objects.get(project_id=2).name, "Test Project 2")

    def test_retrieve_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('name'), self.project.name)

    def test_list_projects(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course.course_id}/projects/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Updated Test Project")

    def test_delete_project(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 0)

    def test_partial_update_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Updated Test Project")

    # tests with an invalid course
    
    def test_create_project_invalid_course(self):
        response = self.client.post(
            API_ENDPOINT + f'100/projects/',
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": 100
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Project.objects.count(), 1)
    
    """TODO
    def test_update_project_invalid_course(self):
        response = self.client.patch(
            API_ENDPOINT + f'100/projects/{self.project.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": 100
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Test Project")
    """
    def test_delete_project_invalid_course(self):
        response = self.client.delete(
            API_ENDPOINT + f'100/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Project.objects.count(), 1)
    
    """TODO
    def test_partial_update_project_invalid_course(self):
        response = self.client.patch(
            API_ENDPOINT + f'100/projects/{self.project.project_id}/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Test Project")
    """
    def test_retrieve_project_invalid_course(self):
        response = self.client.get(
            API_ENDPOINT + f'100/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_projects_invalid_course(self):
        response = self.client.get(
            API_ENDPOINT + f'100/projects/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # test with invalid project

    def test_retrieve_invalid_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course.course_id}/projects/100/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_invalid_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course.course_id}/projects/100/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_partial_update_invalid_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course.course_id}/projects/100/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_invalid_project(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.course.course_id}/projects/100/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class ProjectTestTeacher(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="teacher_username",
            email="test@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
        )

        self.teacher = Teacher.objects.create(
            id=self.user,
            is_admin=False
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
            course_id=self.course
        )

        self.client.force_authenticate(self.user)

    def test_create_project(self):
        response = self.client.post(
            API_ENDPOINT + f'{self.course.course_id}/projects/',
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Updated assertion to use the correct project_id from the response
        created_project_id = response.data.get('project_id')
        self.assertEqual(Project.objects.get(project_id=created_project_id).name, "Test Project 2")
        self.assertEqual(Project.objects.count(), 2)

    def test_retrieve_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('name'), self.project.name)

    def test_list_projects(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course.course_id}/projects/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Updated Test Project")

    def test_delete_project(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Project.objects.count(), 0)

    def test_partial_update_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Updated Test Project")

    # tests with an invalid course

    def test_create_project_invalid_course(self):
        response = self.client.post(
            API_ENDPOINT + f'100/projects/',
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": 100
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.count(), 1)

    def test_retrieve_project_invalid_course(self):
        response = self.client.get(
            API_ENDPOINT + f'100/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_projects_invalid_course(self):
        response = self.client.get(
            API_ENDPOINT + f'100/projects/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # tests with a course not of the teacher

    def test_create_project_course_not_of_teacher(self):
        response = self.client.post(
            API_ENDPOINT + f'{self.course_not_of_teacher.course_id}/projects/',
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": self.course_not_of_teacher.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.count(), 1)

    def test_retrieve_project_course_not_of_teacher(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course_not_of_teacher.course_id}/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_projects_course_not_of_teacher(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course_not_of_teacher.course_id}/projects/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # test with invalid project

    def test_retrieve_invalid_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course.course_id}/projects/100/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ProjectTestStudent(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="student_username",
            email="test@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
        )

        self.student = Student.objects.create(
            id=self.user,
            number=1234567890
        )

        self.course = Course.objects.create(
            name="Test Course",
            description="Test Course Description",
        )

        self.course_not_of_student = Course.objects.create(
            name="Test Course 2",
        )

        self.student.course.set([self.course])

        self.project = Project.objects.create(
            name="Test Project",
            course_id=self.course
        )

        self.client.force_authenticate(self.user)

    def test_create_project(self):
        response = self.client.post(
            API_ENDPOINT + f'{self.course.course_id}/projects/',
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.count(), 1)

    def test_retrieve_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('name'), self.project.name)

    def test_list_projects(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course.course_id}/projects/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Test Project")

    def test_delete_project(self):
        response = self.client.delete(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.count(), 1)

    def test_partial_update_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course.course_id}/projects/{self.project.project_id}/',
            {
                "name": "Updated Test Project"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Test Project")

    # tests with an invalid course

    def test_create_project_invalid_course(self):
        response = self.client.post(
            API_ENDPOINT + f'100/projects/',
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": 100
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.count(), 1)

    def test_retrieve_project_invalid_course(self):
        response = self.client.get(
            API_ENDPOINT + f'100/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_projects_invalid_course(self):
        response = self.client.get(
            API_ENDPOINT + f'100/projects/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # tests with a course not of the student

    def test_create_project_course_not_of_student(self):
        response = self.client.post(
            API_ENDPOINT + f'{self.course_not_of_student.course_id}/projects/',
            {
                "name": "Test Project 2",
                "description": "Test Project 2 Description",
                "course_id": self.course_not_of_student.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.count(), 1)

    def test_retrieve_project_course_not_of_student(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course_not_of_student.course_id}/projects/{self.project.project_id}/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_projects_course_not_of_student(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course_not_of_student.course_id}/projects/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_project_course_not_of_student(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course_not_of_student.course_id}/projects/{self.project.project_id}/',
            {
                "name": "Updated Test Project",
                "description": "Updated Test Project Description",
                "course_id": self.course_not_of_student.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Project.objects.get(project_id=self.project.project_id).name, "Test Project")

    # test with invalid project

    def test_retrieve_invalid_project(self):
        response = self.client.get(
            API_ENDPOINT + f'{self.course.course_id}/projects/100/'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_invalid_project(self):
        response = self.client.patch(
            API_ENDPOINT + f'{self.course.course_id}/projects/100/',
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
            API_ENDPOINT + f'{self.course.course_id}/projects/100/'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
