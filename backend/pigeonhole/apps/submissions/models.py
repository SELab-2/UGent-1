import os

from django.db import models
from docker import DockerClient
from docker.errors import ContainerError, APIError
from rest_framework import serializers

from backend.pigeonhole.apps.groups.models import Group


def get_upload_to(self, filename):
    return (
            "submissions/"
            + str(self.group_id.group_id)
            + "/"
            + str(self.submission_nr)
            + "/input"
            + os.path.splitext(filename)[1]
    )


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
    eval_result = models.BooleanField(default=False)
    objects = models.Manager()

    # submission_nr is automatically assigned and unique per group, and
    # increments
    def save(
            self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        if not self.submission_nr:
            self.submission_nr = (
                    Submissions.objects.filter(group_id=self.group_id).count() + 1
            )
        super(Submissions, self).save(force_insert, force_update, using, update_fields)

        self.eval()

    def eval(self):
        client = DockerClient(base_url='unix://var/run/docker.sock')

        try:
            container = client.containers.run(
                # TODO: replace busybox placeholder image with valid evaluation image
                image='busybox:latest',
                name=f'pigeonhole-submission-{self.submission_id}-evaluation',
                detach=False,
                volumes={
                    'submissions': {
                        'bind': f'/usr/src/submissions/{self.submission_id}',
                        'mode': 'ro'
                    }
                }
            )

        except ContainerError as _:
            self.eval_result = False

        except APIError as _:
            raise IOError('There was an error evaluation the submission')

        client.close()

        # For now, an error thrown by eval() is interpreted as a failed submission and
        # exit code 0 as a successful submission
        # The container object returns the container logs and can be analyzed further


class SubmissionsSerializer(serializers.ModelSerializer):
    submission_nr = serializers.IntegerField(read_only=True)
    group_id = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

    class Meta:
        model = Submissions
        fields = [
            "submission_id",
            "file_urls",
            "timestamp",
            "submission_nr",
            "group_id",
            "draft",
        ]
