from django.test import TestCase

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User


class ProjectTestCase(TestCase):
    def setUp(self):
        # Create teacher user
        teacher = User.objects.create(
            id=1,
            username="teacher_username",
            email="teacher@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
            role=2
        )
        # Create student user
        student = User.objects.create(
            id=2,
            username="student_username",
            email="student@gmail.com",
            first_name="Miss",
            last_name="Piggy",
            role=3
        )

        # Create course
        course = Course.objects.create(name="Math", description="Mathematics")
        teacher.course.add(course)
        student.course.add(course)

        # Create project
        self.project = Project.objects.create(
            name="Project",
            course_id=course,
            deadline="2021-12-12 12:12:12",
            description="Project Description",
        )

    def test_project_course_relation(self):
        self.assertEqual(self.project.course_id.name, "Math")

    def test_project_teacher_relation(self):
        teacher = User.objects.get(id=1)
        self.assertIn(self.project.course_id, teacher.course.all())

    def test_project_student_relation(self):
        student = User.objects.get(id=2)
        self.assertIn(self.project.course_id, student.course.all())

    def test_course_name_length_validation(self):
        with self.assertRaises(Exception):
            Course.objects.create(
                name="A" * 300,
                description="Mock"
            )

    def test_create_project_without_course(self):
        with self.assertRaises(Exception):
            Project.objects.create(
                name="Project",
                description="Project Description",
            )

    def test_update_and_delete_project(self):
        self.project.name = "Project 2"
        self.project.save()
        updated_project = Project.objects.get(name="Project 2")
        self.assertEqual(updated_project.name, "Project 2")

        self.project.delete()
        with self.assertRaises(Project.DoesNotExist):
            Project.objects.get(name="Project 2")
