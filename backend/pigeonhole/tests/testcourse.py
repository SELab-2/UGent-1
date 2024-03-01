from django.test import TestCase
from backend.pigeonhole.apps.courses.models import Course

# python3 manage.py test backend.pigeonhole.tests.testcourse

class CourseTestCase(TestCase):
    def setUp(self):
        Course.objects.create(name="Test Course", code="TST123", description="This is a test course")

    def test_course(self):
        course = Course.objects.get(name="Test Course")
        self.assertEqual(course.code, 'TST123')
        self.assertEqual(course.description, 'This is a test course')