from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.courses.models import Course


# Create your models here.
class Project(models.Model):
    project_id = models.BigAutoField(primary_key=True)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    description = models.TextField()
    deadline = models.DateTimeField()
    visible = models.BooleanField(default=False)


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['project_id', 'course_id', 'name', 'description', 'deadline', 'visible']
