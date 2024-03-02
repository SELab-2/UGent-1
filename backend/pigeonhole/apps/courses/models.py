from django.db import models
from rest_framework import serializers


# Create your models here.

class Course(models.Model):
    course_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=256)
    description = models.TextField()


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id', 'name', 'description']
