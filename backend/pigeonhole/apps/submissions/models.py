from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.groups.models import Group


# Create your models here.
class Submissions(models.Model):
    submission_id = models.BigAutoField(primary_key=True)
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    file = models.FileField(upload_to='uploads/' + str(group_id) + '/' + str(project_id) + '/')
    timestamp = models.DateTimeField(auto_now_add=True)
    submission_nr = models.IntegerField()


class SubmissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submissions
        fields = ['submission_id', 'group_id', 'project_id', 'file', 'timestamp', 'submission_nr']
