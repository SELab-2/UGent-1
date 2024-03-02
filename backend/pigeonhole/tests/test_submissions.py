from django.test import TestCase
from backend.pigeonhole.apps.users.models import User, Student, Teacher
from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.submissions.models import Submissions

# python3 manage.py test backend/


class SubmissionTestCase(TestCase):
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
            description="Project Description",
            deadline="2021-12-12 12:12:12"
        )

        # Create submission
        Submissions.objects.create(
            student_id=student,
            project_id=project
        )

    def test_submission_student_relation(self):
        submission = Submissions.objects.get(
            student_id__id__email="student@gmail.com"
        )
        student = Student.objects.get(id__email="student@gmail.com")
        self.assertEqual(submission.student_id, student)

    def test_submission_project_relation(self):
        submission = Submissions.objects.get(
            student_id__id__email="student@gmail.com"
        )
        project = Project.objects.get(name="Project")
        self.assertEqual(submission.project_id, project)
    
    def update_and_delete_submission(self):
        submission = Submissions.objects.get(
            student_id__id__email="student@gmail.com",
            project_id__name="Project"
        )
        submission.grade = 10
        submission.save()
        submission = Submissions.objects.get(
            student_id__id__email="student@gmail.Com",
            project_id__name="Project"
        )
        self.assertEqual(submission.grade, 10)

        submission.delete()
        with self.assertRaises(Submissions.DoesNotExist):
            Submissions.objects.get(
                student_id__id__email="student@gmail.com",
                project=Project.objects.get(name="Project")
            )
