from django.test import TestCase
from backend.pigeonhole.apps.users.models import User, Student, Teacher
from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project

# python3 manage.py test backend/

class ProjectTestCase(TestCase):
    def setUp(self):
        # Create teacher user
        teacher_user = User.objects.create_user(username="teacher_username", email="teacher@gmail.com", first_name="Kermit", last_name="The Frog")
        # Create student user
        student_user = User.objects.create_user(username="student_username", email="student@gmail.com", first_name="Miss", last_name="Piggy")

        # Create teacher and student using the created users
        teacher = Teacher.objects.create(id=teacher_user)
        student = Student.objects.create(id=student_user, number=1234)

        # Create course
        course = Course.objects.create(name="Math", description="Mathematics")
        teacher.course.add(course)
        student.course.add(course)

        # Create project
        Project.objects.create(name="Project", course_id=course, description="Project Description", deadline="2021-12-12 12:12:12")

    def test_project_course_relation(self):
        project = Project.objects.get(name="Project")
        course = Course.objects.get(name="Math")
        self.assertEqual(project.course_id, course)

    def test_project_teacher_relation(self):
        project = Project.objects.get(name="Project")
        teacher = Teacher.objects.get(id__email="teacher@gmail.com")
        self.assertEqual(project.course_id, teacher.course.all().first())

    def test_project_student_relation(self):
        project = Project.objects.get(name="Project")
        student = Student.objects.get(id__email="student@gmail.com")
        self.assertEqual(project.course_id, student.course.all().first())

    def test_course_name_length_validation(self):
        with self.assertRaises(Exception):
            Course.objects.create(name="A" * 300, description="Mock")

    def test_create_project_without_course(self):
        with self.assertRaises(Exception):
            Project.objects.create(name="Project", description="Project Description", deadline="2021-12-12 12:12:12")

    def test_create_project_without_deadline(self):
        with self.assertRaises(Exception):
            Project.objects.create(name="Project", course_id=Course.objects.get(name="Math"), description="Project Description")

    def test_update_and_delete_project(self):
        project = Project.objects.get(name="Project")
        project.name = "Project 2"
        project.save()
        project = Project.objects.get(name="Project 2")
        self.assertEqual(project.name, "Project 2")

        project.delete()
        with self.assertRaises(Project.DoesNotExist):
            Project.objects.get(name="Project 2")

    



