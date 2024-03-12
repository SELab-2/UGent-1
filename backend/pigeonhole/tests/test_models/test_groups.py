from django.test import TestCase
from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.users.models import User
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project


# python3 manage.py test backend/


class GroupTestCase(TestCase):
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

        # Create a second student user
        student2 = User.objects.create(
            id=3,
            username="student_username2",
            email="student2@gmail.com",
            first_name="Fozzie",
            last_name="Bear",
            role=3
        )

        # Create course
        course = Course.objects.create(name="Math", description="Mathematics")
        teacher.course.add(course)
        student.course.add(course)

        # Create project
        Project.objects.create(
            name="Project",
            course_id=course,
            deadline="2021-12-12 12:12:12",
            description="Project Description",
            number_of_groups=2,
            group_size=2
        )
        # get group with id 1
        group = Group.objects.create(
            group_nr=1,
            project_id=Project.objects.get(name="Project"),
        )

        # Add students to the group
        group.user.set([student, student2])

    def test_group_project_relation(self):
        group = Group.objects.get(group_nr=1)
        project = Project.objects.get(name="Project")
        self.assertEqual(group.project_id, project)

    def test_group_student_relation(self):
        group = Group.objects.get(group_nr=1)
        student = User.objects.get(id=2)
        student2 = User.objects.get(id=3)
        self.assertIn(student, group.user.all())
        self.assertIn(student2, group.user.all())

    def test_group_final_score(self):
        group = Group.objects.get(group_nr=1)
        self.assertEqual(group.final_score, None)

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
