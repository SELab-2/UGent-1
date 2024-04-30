from django.db import models
from django.utils.crypto import get_random_string
from rest_framework import serializers


# Create your models here.
class Course(models.Model):
    course_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=256)
    description = models.TextField()
    open_course = models.BooleanField(default=False)
    invite_token = models.CharField(max_length=20, blank=True, null=True)
    banner = models.FileField(upload_to='course_banners/', blank=True, null=False,
                              default='course_banners/ugent_banner.png')
    archived = models.BooleanField(default=False)
    year = models.IntegerField(default=2024)

    objects = models.Manager()

    def generate_new_token(self):
        # generate a new token (could be useful if you want to use a different invite token)
        token = get_random_string(length=20)
        self.invitation_token = token
        self.save()
        return token

    def save(self, *args, **kwargs):
        # generate new code on initialization of a new course
        if not self.invite_token:
            self.invite_token = get_random_string(length=20)
        return super().save(*args, **kwargs)


class CourseSerializer(serializers.ModelSerializer):
    invite_token = serializers.ReadOnlyField()

    class Meta:
        model = Course
        fields = ['course_id', 'name', 'open_course', 'description', 'invite_token', 'banner', 'archived', 'year']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')

        if request and request.user.is_student:
            if 'invite_token' in data:
                del data['invite_token']
        return data
