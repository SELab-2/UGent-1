from django.test import TestCase
from backend.pigeonhole.apps.users.models import User


# python3 manage.py test backend/

class UserTestCase(TestCase):
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
        User.objects.create(id=teacher_user)
        User.objects.create(id=student_user, number=1234)

    def test_student(self):
        student = User.objects.get(id__email="student@gmail.com")
        self.assertEqual(student.id.email, "student@gmail.com")
        self.assertEqual(student.number, 1234)

        # update student number
        student.number = 5678
        student.save()
        student = User.objects.get(id__email="student@gmail.com")
        self.assertEqual(student.number, 5678)

        # delete student
        student.delete()
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(id__email="student@gmail.com")

    def test_teacher(self):
        teacher = User.objects.get(id__email="teacher@gmail.com")
        self.assertEqual(teacher.id.email, "teacher@gmail.com")
        self.assertEqual(teacher.is_admin, False)

        # update teacher is_admin
        teacher.is_admin = True
        teacher.save()
        teacher = User.objects.get(id__email="teacher@gmail.com")
        self.assertEqual(teacher.is_admin, True)

        self.assertEqual(teacher.is_assistant, False)
        # update teacher is_assistent
        teacher.is_assistant = True
        teacher.save()
        teacher = User.objects.get(id__email="teacher@gmail.com")
        self.assertEqual(teacher.is_assistant, True)
        # delete teacher
        teacher.delete()
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(id__email="teacher@gmail.com")

    def test_create_student_without_user(self):
        with self.assertRaises(Exception):
            User.objects.create(number=1234)

    def test_create_teacher_without_user(self):
        with self.assertRaises(Exception):
            User.objects.create(is_admin=True, is_assistent=True)
