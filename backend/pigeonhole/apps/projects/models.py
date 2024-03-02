from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.courses.models import Course


# Create your models here.
class Project(models.Model):
    project_id = models.BigAutoField(primary_key=True)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    description = models.TextField()
    visible = models.BooleanField(default=False)
    feedback = models.TextField(null=True)
    final_score = models.IntegerField()


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['project_id', 'course_id', 'name', 'description', 'deadline', 'visible']


class Conditions(models.Model):
    condition_id = models.BigAutoField(primary_key=True)
    submission_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    condition = models.CharField(max_length=256)
    deadline = models.DateTimeField()
    test_file_location = models.CharField(max_length=512, null=True)
    test_file_type = models.CharField(max_length=256, null=True)

    objects = models.Manager()

    @property
    def get_forbidden_extensions(self):
        return ForbiddenExtension.objects.filter(project_id=self.submission_id)

    @property
    def get_allowed_extensions(self):
        return AllowedExtension.objects.filter(project_id=self.submission_id)


class AllowedExtension(models.Model):
    extension_id = models.BigAutoField(primary_key=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    extension = models.IntegerField()

    objects = models.Manager()


class ForbiddenExtension(models.Model):
    extension_id = models.BigAutoField(primary_key=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    extension = models.IntegerField()

    objects = models.Manager()
