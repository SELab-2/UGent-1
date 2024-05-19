from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.courses.models import Course
from django.conf import settings


def dockerfile_path(self, _):
    if not self.pk:
        nextpk = Project.objects.order_by('-project_id').first().project_id + 1
        self.id = self.pk = nextpk
    return f'courses/id_{str(self.course_id.course_id)}/project/id_{str(self.project_id)}/DOCKERFILE'

def testfile_path(self, filename):
    if not self.pk:
        nextpk = Project.objects.order_by('-project_id').first().project_id + 1
        self.id = self.pk = nextpk
    return f'courses/id_{str(self.course_id.course_id)}/project/id_{str(self.project_id)}/{filename}'

#legacy code
def get_upload_to(self, filename):
    return 'projects/' + str(self.project_id) + '/' + filename

class Project(models.Model):
    objects = models.Manager()
    project_id = models.BigAutoField(primary_key=True)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    description = models.TextField()
    deadline = models.DateTimeField(null=True, blank=True)
    visible = models.BooleanField(default=False)
    max_score = models.IntegerField(default=10)
    number_of_groups = models.IntegerField(default=5)
    group_size = models.IntegerField(default=1)
    file_structure = models.TextField(blank=True, null=True)
    conditions = models.TextField(blank=True, null=True)

    test_files = models.FileField(blank=True, null=True, upload_to=testfile_path)
    test_dockerfile = models.FileField(blank=True, null=True, upload_to=dockerfile_path)


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["project_id", "course_id", "name", "description", "deadline", "visible", "number_of_groups",
                  "group_size", "max_score", "file_structure", "conditions", "test_files", "test_dockerfile"]


class Test(models.Model):
    project_id = models.ForeignKey(Project, primary_key=True, on_delete=models.CASCADE)
    test_nr = models.IntegerField()
    test_file_type = models.FileField(upload_to='uploads/projects/' +
                                                str(project_id) + '/' + str(test_nr), null=True, blank=False,
                                      max_length=255)

    objects = models.Manager()
