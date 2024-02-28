from django.db import models
from rest_framework import serializers


# Create your models here.

class Person(models.Model):
    person_id = models.BigAutoField(primary_key=True)
    e_mail = models.CharField(max_length=256)
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'e_mail', 'first_name', 'last_name']


class Student(models.Model):
    id = models.ForeignKey(Person, on_delete=models.CASCADE, primary_key=True)
    number = models.IntegerField()
    project = models.ManyToManyField('Project')
    course = models.ManyToManyField('Course')


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['number', 'project', 'course', 'id']


class Teacher(models.Model):
    id = models.ForeignKey(Person, on_delete=models.CASCADE, primary_key=True)
    course = models.ManyToManyField('Course')
    is_admin = models.BooleanField(default=False)
    is_assistent = models.BooleanField(default=False)


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['course', 'id', 'is_admin', 'is_assistent']


class Course(models.Model):
    course_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=256)
    description = models.TextField()


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id', 'name', 'description']


class Project(models.Model):
    project_id = models.BigAutoField(primary_key=True)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    description = models.TextField()
    deadline = models.DateTimeField()
    visible = models.BooleanField(default=False)


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['project_id', 'course_id', 'name', 'description', 'deadline', 'visible']


class Submissions(models.Model):
    submission_id = models.BigAutoField(primary_key=True)
    student_id = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE, null=True)
    file = models.FileField(upload_to='uploads/' + str(student_id) + '/' + str(project_id) + '/')
    timestamp = models.DateTimeField(auto_now_add=True)
    submission_nr = models.AutoField(primary_key=False)


class SubmissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submissions
        fields = ['submission_id', 'student_id', 'project_id', 'file', 'timestamp', 'submission_nr']
