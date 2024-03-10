from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import Student


class Group(models.Model):
    group_id = models.BigAutoField(primary_key=True)
    group_nr = models.IntegerField(blank=True, null=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    student = models.ManyToManyField(Student)
    feedback = models.TextField(null=True)
    final_score = models.IntegerField(null=True, blank=True)

    objects = models.Manager()

    def save(self, *args, **kwargs):
        if not self.group_id:
            if self.group_nr is None:
                max_group_nr = Group.objects.filter(
                    project_id=self.project_id).aggregate(
                        models.Max('group_nr'))['group_nr__max'] or 0
                self.group_nr = max_group_nr + 1
        super().save(*args, **kwargs)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["group_id", "group_nr", "final_score", "project_id", "student", "feedback"]
