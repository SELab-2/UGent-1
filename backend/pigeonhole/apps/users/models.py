from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models

from backend.pigeonhole.apps.courses.models import Course


class Roles(models.IntegerChoices):
    ADMIN = 1
    TEACHER = 2
    STUDENT = 3


class User(AbstractUser):
    id = models.BigAutoField(primary_key=True)
    course = models.ManyToManyField(Course)
    role = models.IntegerField(choices=Roles.choices, default=Roles.STUDENT)

    objects = UserManager()

    class Meta(AbstractUser.Meta):
        db_table = "auth_user"

    @property
    def name(self):
        return f"{self.first_name.strip()} {self.last_name.strip()}"

    @property
    def is_admin(self):
        return self.role == Roles.ADMIN

    @property
    def is_teacher(self):
        return self.role == Roles.TEACHER

    @property
    def is_student(self):
        return self.role == Roles.STUDENT
