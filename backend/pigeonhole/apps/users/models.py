from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework import serializers

from backend.pigeonhole.apps.courses.models import Course


class Roles(models.IntegerChoices):
    SUPERUSER = 1
    TEACHER = 2
    STUDENT = 3


class User(AbstractUser):
    id = models.BigAutoField(primary_key=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=150)
    course = models.ManyToManyField(Course)
    role = models.IntegerField(choices=Roles.choices, default=Roles.STUDENT)

    objects = models.Manager()

    class Meta(AbstractUser.Meta):
        db_table = "auth_user"

    @property
    def name(self):
        return f"{self.first_name.strip()} {self.last_name.strip()}"

    @property
    def is_super(self):
        return self.role == Roles.SUPERUSER

    @property
    def is_teacher(self):
        return self.role == Roles.TEACHER

    @property
    def is_student(self):
        return self.role == Roles.STUDENT


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'course', 'role']
