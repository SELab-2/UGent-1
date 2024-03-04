from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.courses.models import Course


class User(AbstractUser):
    class Meta(AbstractUser.Meta):
        db_table = "auth_user"

    @property
    def name(self):
        return f"{self.first_name.strip()} {self.last_name.strip()}"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'e_mail', 'first_name', 'last_name']


class Student(models.Model):
    id = models.ForeignKey(User, on_delete=models.CASCADE, primary_key=True)
    number = models.IntegerField()
    course = models.ManyToManyField(Course)

    objects = models.Manager()


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['number', 'course', 'id']


class Teacher(models.Model):
    id = models.ForeignKey(User, on_delete=models.CASCADE, primary_key=True)
    course = models.ManyToManyField(Course)
    is_admin = models.BooleanField(default=False)
    is_assistent = models.BooleanField(default=False)

    objects = models.Manager()


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['course', 'id', 'is_admin', 'is_assistent']
