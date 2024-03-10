from django.test import TestCase
from backend.pigeonhole.apps.users.models import User, Student, Teacher
from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project, Conditions, AllowedExtension, ForbiddenExtension


class ConditionsTestCase(TestCase):
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
        teacher = Teacher.objects.create(id=teacher_user)
        student = Student.objects.create(id=student_user, number=1234)

        # Create course
        course = Course.objects.create(name="Math", description="Mathematics")
        teacher.course.add(course)
        student.course.add(course)

        # Create project
        project = Project.objects.create(
            name="Project",
            course_id=course,
            deadline="2021-12-12 12:12:12",
            description="Project Description"
        )

        # Create conditions
        self.conditions = Conditions.objects.create(
            submission_id=project,
            condition="Condition 1",
            test_file_location="path/to/test",
            test_file_type="txt"
        )

        # Create allowed extension
        AllowedExtension.objects.create(
            project_id=project,
            extension=123
        )

        # Create forbidden extension
        ForbiddenExtension.objects.create(
            project_id=project,
            extension=456
        )

    def test_conditions_submission_relation(self):
        self.assertEqual(self.conditions.submission_id, Project.objects.get(name="Project"))

    def test_conditions_forbidden_extensions(self):
        self.assertEqual(len(self.conditions.get_forbidden_extensions), 1)

    def test_conditions_allowed_extensions(self):
        self.assertEqual(len(self.conditions.get_allowed_extensions), 1)

    def test_create_conditions_without_submission(self):
        with self.assertRaises(Exception):
            Conditions.objects.create(
                condition="Condition 2",
                test_file_location="path/to/test",
                test_file_type="txt"
            )

    def test_allowed_extension(self):
        allowed_extension = AllowedExtension.objects.get(extension=123)
        self.assertEqual(allowed_extension.project_id, Project.objects.get(name="Project"))

    def test_forbidden_extension(self):
        forbidden_extension = ForbiddenExtension.objects.get(extension=456)
        self.assertEqual(forbidden_extension.project_id, Project.objects.get(name="Project"))

    def test_update_and_delete_conditions(self):
        self.conditions.condition = "Condition 2"
        self.conditions.save()
        updated_conditions = Conditions.objects.get(condition="Condition 2")
        self.assertEqual(updated_conditions.condition, "Condition 2")

        # Delete associated extensions explicitly
        AllowedExtension.objects.filter(project_id=self.conditions.submission_id).delete()
        ForbiddenExtension.objects.filter(project_id=self.conditions.submission_id).delete()

        self.conditions.delete()
        with self.assertRaises(Conditions.DoesNotExist):
            Conditions.objects.get(condition="Condition 2")

        # Check if associated extensions are deleted as well
        with self.assertRaises(AllowedExtension.DoesNotExist):
            AllowedExtension.objects.get(extension=123)

        with self.assertRaises(ForbiddenExtension.DoesNotExist):
            ForbiddenExtension.objects.get(extension=456)
