import os

from django.db import models
from docker import DockerClient
from docker.errors import ContainerError, APIError
from rest_framework import serializers

from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from django.conf import settings


SUBMISSIONS_PATH = os.environ.get('SUBMISSIONS_PATH')
registry_name = os.environ.get('REGISTRY_NAME')

def submission_folder_path(group_id, submission_id):
    return f"{str(settings.STATIC_ROOT)}/submissions/group_{group_id}/{submission_id}"

def submission_folder_path_hostside(group_id, submission_id):
    return f"{SUBMISSIONS_PATH}/group_{group_id}/{submission_id}"

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

    eval_result = models.BooleanField(default=False)
    eval_output = models.TextField(null=True)

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

        #self.eval()

    def eval(self):
        client = DockerClient(base_url='unix://var/run/docker.sock')

        group = self.group_id
        project = group.project_id

        try:
            print("running docker container")
            image_id = f"{registry_name}/{project.test_docker_image}"

            container = client.containers.run(
                image=image_id,
                name=f'pigeonhole-submission-{self.submission_id}-evaluation',
                detach=False,
                remove=False, # TODO: set to true after testing
                environment={
                    'SUBMISSION_ID': self.submission_id,
                },
                volumes={
                    f'{submission_folder_path_hostside(group_id=self.group_id.group_id, submission_id=self.submission_id)}': {
                        'bind': '/usr/src/submission/',
                        'mode': 'ro'
                    }
                }
            )

            # For now, an error thrown by eval() is interpreted as a failed submission and
            # exit code 0 as a successful submission
            # The container object returns the container logs and can be analyzed further

            #self.eval_output = container.logs()
            #print(self.eval_output)

            #container.remove(force=True)

        except ContainerError as ce:
            print(ce)
            print("container failed")
            self.eval_result = False
            client.close()
            return

        except APIError as e:
            raise IOError(f'There was an error evaluation the submission: {e}')

        print("evaluation success!")
        self.eval_result = True

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
        ]
