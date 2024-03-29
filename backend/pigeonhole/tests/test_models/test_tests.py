from django.test import TestCase

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project, Test
from backend.pigeonhole.apps.users.models import User


class ConditionsTestCase(TestCase):
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
        project = Project.objects.create(
            name="Project",
            course_id=course,
            description="Project Description"
        )

        # Create conditions
        self.test_obj = Test.objects.create(
            project_id=project,
            test_nr=1,
        )

    def test_conditions_submission_relation(self):
        self.assertEqual(self.test_obj.project_id, Project.objects.get(name="Project"))

    def test_create_conditions_without_submission(self):
        with self.assertRaises(Exception):
            Test.objects.create(
                test_nr=1,
            )

    def test_update_and_delete_conditions(self):
        self.test_obj.test_nr = 2
        self.test_obj.save()
        updated_test_obj = Test.objects.get(test_nr=2)
        self.assertEqual(updated_test_obj.test_nr, 2)

        self.test_obj.delete()
        with self.assertRaises(Test.DoesNotExist):
            Test.objects.get(test_nr=2)
