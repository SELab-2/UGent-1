from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import Student


class Group(models.Model):
    group_id = models.BigAutoField(primary_key=True)
    group_nr = models.IntegerField()
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    student = models.ManyToManyField(Student)
    feedback = models.TextField(null=True)
    final_score = models.IntegerField()

    objects = models.Manager()


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["group_id", "group_nr", "final_score", "project_id", "student"]
