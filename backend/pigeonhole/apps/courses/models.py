from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.users.models import Student, Teacher


# Create your models here.
class Course(models.Model):
    course_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=256)
    description = models.TextField()
    student = models.ManyToManyField(Student)
    teacher = models.ManyToManyField(Teacher)


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id', 'name', 'description', 'student', 'teacher']
