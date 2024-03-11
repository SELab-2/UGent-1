from django.test import TestCase
from backend.pigeonhole.apps.users.models import User
from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project


class ProjectTestCase(TestCase):
    def setUp(self):
        # Create teacher user
        teacher_user = User.objects.create_user(
            username="teacher_username",
            email="teacher@gmail.com",
            first_name="Kermit",
            last_name="The Frog"
        )
        # Create student user
        student_user = User.objects.create_user(
            username="student_username",
            email="student@gmail.com",
            first_name="Miss",
            last_name="Piggy"
        )

        # Create teacher and student using the created users
        teacher = User.objects.create(id=teacher_user)
        student = User.objects.create(id=student_user, number=1234)

        # Create course
        course = Course.objects.create(name="Math", description="Mathematics")
        teacher.course.add(course)
        student.course.add(course)

        # Create project
        self.project = Project.objects.create(
            name="Project",
            course_id=course,
            description="Project Description",
        )

    def test_project_course_relation(self):
        self.assertEqual(self.project.course_id.name, "Math")

    def test_project_teacher_relation(self):
        teacher = User.objects.get(id__email="teacher@gmail.com")
        self.assertIn(self.project.course_id, teacher.course.all())

    def test_project_student_relation(self):
        student = User.objects.get(id__email="student@gmail.com")
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
