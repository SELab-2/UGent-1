from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.submissions.models import Submission
from backend.pigeonhole.apps.users.models import User

ROUTES_PREFIX = '/courses/'


class CompleteTestAdmin(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a teacher user
        self.teacher = User.objects.create(
            username="teacher_username",
            email="teacher@gmail.com",
            first_name="Teacher",
            last_name="LastName",
            role=2  # Teacher role
        )

        # Create a student user
        self.student = User.objects.create(
            username="student_username",
            email="student@gmail.com",
            first_name="Student",
            last_name="LastName",
            role=3  # Student role
        )

        # Authenticate the teacher user
        self.client.force_authenticate(self.teacher)

        self.course = Course.objects.create(
            name="Test Course",
            description="Test Course Description",
        )

    def test_create_course(self):
        # Use the teacher to create the course
        response = self.client.post(
            ROUTES_PREFIX,
            {
                "name": "Test Course 2",
                "description": "Test Course 2 Description",
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Course.objects.count(), 2)
        self.assertEqual(Course.objects.get(course_id=2).name, "Test Course 2")

    def test_create_project(self):
        # Use the teacher to create the project for the course
        response = self.client.post(
            ROUTES_PREFIX + f'{self.course.course_id}/projects/',
            {
                "name": "Test Project",
                "description": "Test Project Description",
                "course_id": self.course.course_id
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 1)
        self.assertEqual(Project.objects.get(project_id=1).name, "Test Project")

    def test_create_submission(self):
        # Authenticate the student user
        self.client.force_authenticate(self.student)

        # Use the student to create the submission for the project
        response = self.client.post(
            ROUTES_PREFIX + f'{self.course.course_id}/projects/1/submissions/',
            {
                "project_id": 1,
                "student_id": self.student.id,  # Use the student's id
                "submission": "Test Submission",
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Submission.objects.count(), 1)
        self.assertEqual(Submission.objects.get(submission_id=1).submission, "Test Submission")
