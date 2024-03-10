from django.contrib.auth.models import update_last_login
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings

from backend.pigeonhole.apps.users.models import User, Student, Teacher


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'e_mail', 'first_name', 'last_name']


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['number', 'course', 'id']


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['course', 'id', 'is_admin', 'is_assistent']


class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['user'] = UserSerializer(self.user).data
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data
