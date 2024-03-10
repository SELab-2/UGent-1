from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.groups.models import Group


# Create your models here.
class Submissions(models.Model):
    submission_id = models.BigAutoField(primary_key=True)
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE, blank=False)
    submission_nr = models.IntegerField()
    file = models.FileField(upload_to='uploads/submissions/files/' +
                            str(group_id) + '/' + str(submission_nr) + '/',
                            null=True, blank=False, max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    output_test = models.FileField(upload_to='uploads/submissions/outputs/' +
                                   str(group_id) + '/' + str(submission_nr) +
                                   '/output_test/', null=True, blank=False,
                                   max_length=255)

    objects = models.Manager()


class SubmissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submissions
        fields = ['submission_id', 'group_id', 'file', 'timestamp', 'submission_nr', 'output_test']
