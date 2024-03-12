from django.core.exceptions import ValidationError
from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User


class Group(models.Model):
    group_id = models.BigAutoField(primary_key=True)
    group_nr = models.IntegerField(blank=True, null=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ManyToManyField(User)
    feedback = models.TextField(null=True)
    final_score = models.IntegerField(null=True, blank=True)
    visible = models.BooleanField(null=False, default=False)

    objects = models.Manager()

    def __str__(self):
        return str(self.id)

    # a student can only be in one group per project
    def clean(self):
        for student in self.user.all():
            existing_groups = Group.objects.filter(
                project_id=self.project_id, student=student).exclude(
                group_id=self.group_id)
            if existing_groups.exists():
                raise ValidationError(f"Student {student} is already part of "
                                      "another group in this project.")

    # a student can only be in one group per project, group_nr is
    # automatically assigned and unique per project
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
        fields = ["group_id", "group_nr", "final_score", "project_id", "user", "feedback", "visible"]

    def get_visible_data(self):
        # remove certain fields if visible is false.
        data = self.data.copy()
        if not self.instance.visible:
            if 'final_score' in data:
                del data['final_score']
            if 'feedback' in data:
                del data['feedback']
        return data

    def get_other_group(self):
        # remove certain fields if visible is false.
        data = self.data.copy()
        if 'final_score' in data:
            del data['final_score']
        if 'feedback' in data:
            del data['feedback']
        return data
