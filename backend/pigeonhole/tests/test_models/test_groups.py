from django.test import TestCase
from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.users.models import User, Student, Teacher
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project


# python3 manage.py test backend/


class GroupTestCase(TestCase):
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

        # Create a second student user
        student_user2 = User.objects.create_user(
            username="student_username2",
            email="student2@gmail.com",
            first_name="Fozzie",
            last_name="Bear"
        )

        # Create teacher and student using the created users
        teacher = Teacher.objects.create(id=teacher_user)
        student = Student.objects.create(id=student_user, number=1234)
        student2 = Student.objects.create(id=student_user2, number=5678)

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

        # Create group
        group = Group.objects.create(
            group_nr=1,
            project_id=project,
            final_score=0,
        )

        # Add students to the group
        group.student.set([student, student2])

    def test_group_project_relation(self):
        group = Group.objects.get(group_nr=1)
        project = Project.objects.get(name="Project")
        self.assertEqual(group.project_id, project)

    def test_group_student_relation(self):
        group = Group.objects.get(group_nr=1)
        student = Student.objects.get(id__email="student@gmail.com")
        student2 = Student.objects.get(id__email="student2@gmail.com")
        self.assertIn(student, group.student.all())
        self.assertIn(student2, group.student.all())

    def test_group_final_score(self):
        group = Group.objects.get(group_nr=1)
        self.assertEqual(group.final_score, 0)

    def test_group_group_nr(self):
        group = Group.objects.get(group_nr=1)
        self.assertEqual(group.group_nr, 1)

    def test_update_and_delete_group(self):
        group = Group.objects.get(group_nr=1)
        group.final_score = 10
        group.save()
        group = Group.objects.get(group_nr=1)
        self.assertEqual(group.final_score, 10)

        group.delete()
        with self.assertRaises(Group.DoesNotExist):
            Group.objects.get(group_nr=1)
