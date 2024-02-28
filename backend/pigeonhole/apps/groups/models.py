from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.projects.models import Project


class Group(models.Model):
    group_id = models.BigAutoField(primary_key=True)
    group_nr = models.IntegerField()
    final_score = models.IntegerField()
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["group_id", "group_nr", "final_score", "project_id"]
