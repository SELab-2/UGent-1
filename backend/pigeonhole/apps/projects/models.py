from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.courses.models import Course


class Project(models.Model):
    objects = models.Manager()
    project_id = models.BigAutoField(primary_key=True)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    description = models.TextField()
    deadline = models.DateTimeField(null=True, blank=True)
    visible = models.BooleanField(default=False)
    max_score = models.IntegerField(null=True, blank=True)
    number_of_groups = models.IntegerField(default=5)
    group_size = models.IntegerField(default=1)
    file_structure = models.CharField(max_length=1024, null=True)
    max_score = models.IntegerField(null=True, blank=True)


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["project_id", "course_id", "name", "description", "deadline", "visible", "number_of_groups",
                  "group_size", "max_score", "file_structure"]


class Test(models.Model):
    project_id = models.ForeignKey(Project, primary_key=True, on_delete=models.CASCADE)
    test_nr = models.IntegerField()
    test_file_type = models.FileField(upload_to='uploads/projects/' +
                                                str(project_id) + '/' + str(test_nr), null=True, blank=False,
                                      max_length=255)

    objects = models.Manager()
