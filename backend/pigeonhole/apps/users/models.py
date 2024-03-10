from django.contrib.auth.models import AbstractUser
from django.db import models

from backend.pigeonhole.apps.courses.models import Course


class User(AbstractUser):
    class Meta(AbstractUser.Meta):
        db_table = "auth_user"

    @property
    def name(self):
        return f"{self.first_name.strip()} {self.last_name.strip()}"


class Student(models.Model):
    id = models.ForeignKey(User, on_delete=models.CASCADE, primary_key=True)
    number = models.IntegerField()
    course = models.ManyToManyField(Course)

    objects = models.Manager()


class Teacher(models.Model):
    id = models.ForeignKey(User, on_delete=models.CASCADE, primary_key=True)
    course = models.ManyToManyField(Course)
    is_admin = models.BooleanField(default=False)
    is_assistant = models.BooleanField(default=False)

    objects = models.Manager()
