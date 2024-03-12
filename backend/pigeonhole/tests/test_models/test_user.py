from django.test import TestCase
from backend.pigeonhole.apps.users.models import User


# python3 manage.py test backend/

class UserTestCase(TestCase):
    def setUp(self):
        # Create teacher user
        User.objects.create(
            id=1,
            username="teacher_username",
            email="teacher@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
            role=2
        )

        # Create student user
        User.objects.create(
            id=2,
            username="student_username",
            email="student@gmail.com",
            first_name="Miss",
            last_name="Piggy",
            role=3
        )

    def test_student_fields(self):
        student = User.objects.get(id=1),
        self.assertEqual(student[0].username, "teacher_username")
        self.assertEqual(student[0].email, "teacher@gmail.com")
        self.assertEqual(student[0].first_name, "Kermit")
        self.assertEqual(student[0].last_name, "The Frog")
        self.assertEqual(student[0].role, 2)

    def test_teacher_fields(self):
        teacher = User.objects.get(id=2),
        self.assertEqual(teacher[0].username, "student_username")
        self.assertEqual(teacher[0].email, "student@gmail.com"),
        self.assertEqual(teacher[0].first_name, "Miss")
        self.assertEqual(teacher[0].last_name, "Piggy")
        self.assertEqual(teacher[0].role, 3)

    def test_user_name_length_validation(self):
        with self.assertRaises(Exception):
            User.objects.create(
                username="A" * 300,
                email="student@gmail.com",
                first_name="Miss",
                last_name="Piggy",
                role=3
            )

    # TODO 
    def test_user_correct_email(self):
        with self.assertRaises(Exception):
            User.objects.create(
                username="student_username",
                email="studentgmail.com",
                first_name="Miss",
                last_name="Piggy",
                role=3
            )

    def test_user_role_validation(self):
        with self.assertRaises(Exception):
            User.objects.create(
                username="student_username",
                email="student@gmail.com",
                first_name="Miss",
                last_name="Piggy",
                role=4
            )
