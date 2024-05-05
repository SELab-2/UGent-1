from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.submissions.models import Submissions
from backend.pigeonhole.apps.users.models import User


class SubmissionTestCase(TestCase):
    def setUp(self):
        # Create teacher user
        teacher = User.objects.create(
            username="teacher_username",
            email="teacher@gmail.com",
            first_name="Kermit",
            last_name="The Frog",
            role=2,
        )
        # Create student user
        student = User.objects.create(
            username="student_username",
            email="student@gmail.com",
            first_name="Miss",
            last_name="Piggy",
            role=3,
        )

        # Create course
        course = Course.objects.create(name="Math", description="Mathematics")
        teacher.course.add(course)
        student.course.add(course)

        # Create project
        project = Project.objects.create(
            name="Project",
            course_id=course,
            deadline="2021-12-12 12:12:12",
            description="Project Description",
        )

        # Create group
        group = Group.objects.create(
            project_id=project,
            group_id=1,
        )

        # Add student to the group
        group.user.set([student])

        # Create submission
        Submissions.objects.create(
            submission_id=1, group_id=group, file_urls="file_urls"
        )

    def test_submission_student_relation(self):
        submission = Submissions.objects.get(submission_id=1)
        student = submission.group_id.user.first()
        self.assertEqual(submission.group_id.user.count(), 1)
        self.assertEqual(submission.group_id.user.first(), student)
        self.assertEqual(submission.group_id.user.first().id, student.id)

    def test_submission_project_relation(self):
        submission = Submissions.objects.get(submission_id=1)
        project = submission.group_id.project_id
        self.assertEqual(submission.group_id.project_id, project)

    def test_submission_course_relation(self):
        submission = Submissions.objects.get(submission_id=1)
        course = submission.group_id.project_id.course_id
        self.assertEqual(submission.group_id.project_id.course_id, course)

    def test_make_submission(self):
        group = Group.objects.get(group_id=1)
        submission = Submissions.objects.create(
            submission_id=2,
            group_id=group,
            file_urls="file_urls",
        )
        self.assertEqual(submission.group_id, group)
        self.assertEqual(submission.file_urls, "file_urls")
        self.assertEqual(submission.submission_nr, 2)

    def test_make_submission_with_file(self):
        group = Group.objects.get(group_id=1)
        file = SimpleUploadedFile("file.txt", b"file_content")
        submission = Submissions.objects.create(
            submission_id=2,
            group_id=group,
            file_urls=file,
        )
        self.assertEqual(submission.group_id, group)
        self.assertEqual(submission.file_urls, file)
        self.assertEqual(submission.submission_nr, 2)
