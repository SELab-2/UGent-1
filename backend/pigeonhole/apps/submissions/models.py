import os

from django.conf import settings
from django.db import models
from docker import DockerClient
from docker.errors import ContainerError, APIError
from rest_framework import serializers

from backend.pigeonhole.apps.groups.models import Group

SUBMISSIONS_PATH = os.environ.get('SUBMISSIONS_PATH')
ARTIFACTS_PATH = os.environ.get('ARTIFACTS_PATH')
registry_name = os.environ.get('REGISTRY_NAME')

if not SUBMISSIONS_PATH:
    SUBMISSIONS_PATH = "/home/selab2/testing/submisssions"

if not ARTIFACTS_PATH:
    ARTIFACTS_PATH = "/home/selab2/testing/artifacts"

if not registry_name:
    registry_name = "sel2-1.ugent.be:2002"


def submission_folder_path(group_id, submission_id):
    return f"{str(settings.STATIC_ROOT)}/submissions/group_{group_id}/{submission_id}"


def artifacts_folder_path(group_id, submission_id):
    return f"{str(settings.STATIC_ROOT)}/artifacts/group_{group_id}/{submission_id}"


def submission_folder_path_hostside(group_id, submission_id):
    return f"{SUBMISSIONS_PATH}/group_{group_id}/{submission_id}"


def artifact_folder_path_hostside(group_id, submission_id):
    return f"{ARTIFACTS_PATH}/group_{group_id}/{submission_id}"


# TODO test timestamp, file, output_test
def submission_file_path(group_id, submission_id, relative_path):
    return submission_folder_path(group_id, submission_id) + '/' + relative_path


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

    eval_result = models.BooleanField(default=None, null=True)
    eval_output = models.TextField(null=True)

    output_simple_test = models.BooleanField(default=False, blank=True)
    feedback_simple_test = models.JSONField(null=True, blank=True)
    objects = models.Manager()

    # submission_nr is automatically assigned and unique per group, and
    # increments
    def save(
            self, *args, **kwargs
    ):
        if not self.submission_nr:
            self.submission_nr = (
                    Submissions.objects.filter(group_id=self.group_id).count() + 1
            )

        super().save(*args, **kwargs)

        # self.eval()

    def eval(self):


        group = self.group_id
        project = group.project_id

        if not project.test_docker_image:
            self.eval_result = True
            super().save(update_fields=["eval_result"])
            return

        client = DockerClient(base_url='unix://var/run/docker.sock')

        try:
            print(f"running evaluation container for submission {self.submission_id}")
            image_id = f"{registry_name}/{project.test_docker_image}"

            container = client.containers.run(
                image=image_id,
                name=f'pigeonhole-submission-{self.submission_id}-evaluation',
                detach=False,
                remove=True,
                volumes={
                    f'{submission_folder_path_hostside(self.group_id.group_id, self.submission_id)}': {
                        'bind': '/usr/src/submission/',
                        'mode': 'ro'
                    },
                    f'{artifact_folder_path_hostside(self.group_id.group_id, self.submission_id)}': {
                        'bind': '/usr/out/artifacts/',
                        'mode': 'rw'
                    }
                }
            )

            # For now, an error thrown by eval() is interpreted as a failed submission and
            # exit code 0 as a successful submission
            # The container object returns the container logs and can be analyzed further

            # this gave an error when i ran it so i commented it out
            self.eval_output = container.decode('utf-8')
            super().save(update_fields=["eval_output"])

        except ContainerError as ce:
            print(ce)
            print(f"evaluation container for submission {self.submission_id} FAILED")

            self.eval_result = False
            self.eval_output = ce
            super().save(update_fields=["eval_result", "eval_output"])

            client.close()
            return

        except APIError as e:
            raise IOError(f'There was an error evaluation the submission: {e}')

        print(f"evaluation container for submission {self.submission_id} SUCCES")

        self.eval_result = True
        super().save(update_fields=["eval_result"])

        client.close()


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
            "output_simple_test",
            "feedback_simple_test",
            "eval_result",
            "eval_output"
        ]
