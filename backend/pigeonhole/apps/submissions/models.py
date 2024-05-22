import os
from io import BytesIO
from zipfile import ZipFile, ZIP_DEFLATED

from background_task import background
from django.core.files.base import ContentFile
from django.db import models
from docker import DockerClient
from docker.errors import ContainerError, APIError
from rest_framework import serializers

from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project

SUBMISSION_PATH = os.environ.get('SUBMISSION_PATH')
ARTIFACT_PATH = os.environ.get('ARTIFACT_PATH')

registry_name = os.environ.get('REGISTRY_NAME')


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
    eval_output = models.TextField(null=True)
    eval_artifacts = models.FileField(upload_to='artifacts/', null=True)

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

        # self.eval()

    def eval(self, detached=True):
        client = DockerClient(base_url='unix://var/run/docker.sock')

        group = Group.objects.get(group_id=self.group_id)
        project = Project.objects.get(project_id=group.project_id)

        try:
            image_id = f"{registry_name}/{project.test_docker_image}"

            container = client.containers.run(
                image=image_id,
                name=f'pigeonhole-submission-{self.submission_id}-evaluation',
                detach=detached,
                remove=True,
                environment={
                    'SUBMISSION_ID': self.submission_id,
                },
                volumes={
                    f'{SUBMISSION_PATH}/{self.group_id}/{self.submission_nr}': {
                        'bind': '/usr/src/submission/',
                        'mode': 'ro'
                    },
                    f'{ARTIFACT_PATH}/{self.group_id}/{self.submission_nr}': {
                        'bind': '/usr/src/output/',
                        'mode': 'ro'
                    }
                }
            )

            # For now, an error thrown by eval() is interpreted as a failed submission and
            # exit code 0 as a successful submission
            # The container object returns the container logs and can be analyzed further

            if detached:
                self.run_container(self, container, client)
                return

            self.collect_artifacts()
            self.eval_output = container.logs()

            container.remove(force=True)

        except ContainerError:
            self.eval_result = False

        except APIError as e:
            client.close()
            raise IOError(f'There was an error evaluation the submission: {e}')

        self.eval_result = True

        client.close()

    @background()
    def run_container(self, container, client):
        container.wait()
        self.eval_output = container.logs()
        self.collect_artifacts()
        container.remove(force=True)
        client.close()

    def collect_artifacts(self):
        zip_buffer = BytesIO()

        artifact_path = f'{ARTIFACT_PATH}/{self.group_id}/{self.submission_nr}'

        with ZipFile(zip_buffer, 'w', ZIP_DEFLATED) as zip_file:
            for root, _, files in os.walk(artifact_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, start=artifact_path)
                    zip_file.write(file_path, arcname=arcname)

        zip_buffer.seek(0)
        zip_file_name = os.path.basename(os.path.normpath(artifact_path)) + '.zip'
        self.eval_artifacts.save(zip_file_name, ContentFile(zip_buffer.read()), save=True)


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
