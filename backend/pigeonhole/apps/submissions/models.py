from django.db import models
from pigeonhole.apps.projects.models import Project
from pigeonhole.apps.users.models import Student
from rest_framework import serializers


# Create your models here.
class Submissions(models.Model):
    submission_id = models.BigAutoField(primary_key=True)
    student_id = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE, null=True)
    file = models.FileField(upload_to='uploads/' + str(student_id) + '/' + str(project_id) + '/')
    timestamp = models.DateTimeField(auto_now_add=True)


class SubmissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submissions
        fields = ['submission_id', 'student_id', 'project_id', 'file', 'timestamp', 'submission_nr']
