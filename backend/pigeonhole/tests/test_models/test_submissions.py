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
            role=2
        )
        # Create student user
        student = User.objects.create(
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
            deadline="2021-12-12 12:12:12",
            description="Project Description",
        )

        # Create group
        group = Group.objects.create(
            project_id=project,
        )

        # Add student to the group
        group.user.set([student])

        # Create submission
        Submissions.objects.create(
            group_id=group,
        )

    def test_submission_student_relation(self):
        submission = Submissions.objects.get(submission_nr=1)
        student = submission.group_id.user.first()
        self.assertEqual(submission.group_id.user.count(), 1)
        self.assertEqual(submission.group_id.user.first(), student)
        self.assertEqual(submission.group_id.user.first().id, student.id)

    def test_submission_project_relation(self):
        submission = Submissions.objects.get(submission_nr=1)
        project = submission.group_id.project_id
        self.assertEqual(submission.group_id.project_id, project)

    def test_submission_file_upload_and_retrieval(self):
        submission = Submissions.objects.get(submission_nr=1)

        # Create a simple text file for testing
        file_content = b'This is a test file content.'
        uploaded_file = SimpleUploadedFile("test.txt", file_content, content_type="text/plain")

        # Set the file field in the submission with the created file
        submission.file = uploaded_file
        submission.save()

        # Retrieve the submission from the database
        updated_submission = Submissions.objects.get(submission_nr=1)

        # Check that the file content matches
        self.assertEqual(updated_submission.file.read(), file_content)

        # Clean up: Delete the file after testing
        if updated_submission.file:
            # Check if the file exists before attempting to delete it
            if updated_submission.file.storage.exists(updated_submission.file.name):
                # Delete the file
                updated_submission.file.storage.delete(updated_submission.file.name)

        # Verify that the file is deleted or doesn't exist
        self.assertFalse(updated_submission.file.storage.exists(updated_submission.file.name))

    def test_submission_output_test_upload_and_retrieval(self):
        submission = Submissions.objects.get(submission_nr=1)

        # Create a simple text file for testing
        file_content = b'This is a test file content.'
        uploaded_file = SimpleUploadedFile("text_output.txt", file_content, content_type="text/plain")

        # Set the file field in the submission with the created file
        submission.file = uploaded_file
        submission.save()

        # Retrieve the submission from the database
        updated_submission = Submissions.objects.get(submission_nr=1)

        # Check that the file content matches
        self.assertEqual(updated_submission.file.read(), file_content)

        # Clean up: Delete the file after testing
        if updated_submission.file:
            # Check if the file exists before attempting to delete it
            if updated_submission.file.storage.exists(updated_submission.file.name):
                # Delete the file
                updated_submission.file.storage.delete(updated_submission.file.name)

        # Verify that the file is deleted or doesn't exist
        self.assertFalse(updated_submission.file.storage.exists(updated_submission.file.name))
