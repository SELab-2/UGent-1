from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project


class Person(models.Model):
    person_id = models.BigAutoField(primary_key=True)
    e_mail = models.CharField(max_length=256)
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)

    @property
    def name(self):
        return f"{self.first_name.strip()} {self.last_name.strip()}"


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'e_mail', 'first_name', 'last_name']


class Student(models.Model):
    id = models.ForeignKey(Person, on_delete=models.CASCADE, primary_key=True)
    number = models.IntegerField()
    project = models.ManyToManyField(Project)
    course = models.ManyToManyField(Course)


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['number', 'project', 'course', 'id']


class Teacher(models.Model):
    id = models.ForeignKey(Person, on_delete=models.CASCADE, primary_key=True)
    course = models.ManyToManyField(Course)
    is_admin = models.BooleanField(default=False)
    is_assistent = models.BooleanField(default=False)


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['course', 'id', 'is_admin', 'is_assistent']
