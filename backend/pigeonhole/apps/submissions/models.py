import os

from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.groups.models import Group


def get_upload_to(self, filename):
    return 'submissions/' + str(self.group_id.group_id) + '/' + str(self.submission_nr) + '/input' + \
        os.path.splitext(filename)[1]


def get_upload_to_test(self, filename):
    return None  # TODO implement this


# Create your models here.
class Submissions(models.Model):
    submission_id = models.BigAutoField(primary_key=True)
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE, blank=True)
    submission_nr = models.IntegerField(blank=True)
    # een JSON encoded lijst relative file paths van de geuploade folder,
    # hiermee kunnen dan de static file urls afgeleid worden
    file_urls = models.TextField(null=True)
    timestamp = models.DateTimeField(auto_now_add=True, blank=True)
    draft = models.BooleanField(default=True)
    objects = models.Manager()

    # submission_nr is automatically assigned and unique per group, and
    # increments
    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        if not self.submission_nr:
            self.submission_nr = Submissions.objects.filter(group_id=self.group_id).count() + 1
        super(Submissions, self).save(force_insert, force_update, using, update_fields)

class SubmissionsSerializer(serializers.ModelSerializer):
    submission_nr = serializers.IntegerField(read_only=True)
    group_id = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

    class Meta:
        model = Submissions
        fields = ['submission_id', 'file_urls', 'timestamp', 'submission_nr', 'group_id', 'draft']
