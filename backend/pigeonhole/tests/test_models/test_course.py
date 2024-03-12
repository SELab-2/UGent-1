from django.test import TestCase
from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.users.models import User
from django.db.utils import DataError


# python3 manage.py test backend/


class CourseTestCase(TestCase):
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

    def test_course_teacher_relationship(self):
        teacher = User.objects.get(id=1)
        course = Course.objects.get(name="Math")
        self.assertIn(course, teacher.course.all())
        course_alter_ego = teacher.course.get(name="Math")
        self.assertEqual(course, course_alter_ego)
        self.assertTrue(course_alter_ego, "Mathematics")

    def test_course_students_relationship(self):
        student = User.objects.get(id=2)
        course = Course.objects.get(name="Math")
        self.assertIn(course, student.course.all())
        course_alter_ego = student.course.get(name="Math")
        self.assertEqual(course, course_alter_ego)
        self.assertTrue(course_alter_ego, "Mathematics")

    def test_course_name_length_validation(self):
        with self.assertRaises(DataError):
            Course.objects.create(name="A" * 300, description="Mock")

    def update_and_delete_course(self):
        course = Course.objects.get(name="Math")
        course.name = "Mathematics"
        course.save()
        course = Course.objects.get(name="Mathematics")
        self.assertEqual(course.name, "Mathematics")

        course.delete()
        with self.assertRaises(Course.DoesNotExist):
            Course.objects.get(name="Mathematics")
