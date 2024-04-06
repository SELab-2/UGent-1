from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.pigeonhole.apps.courses.models import CourseSerializer
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.projects.models import ProjectSerializer
from backend.pigeonhole.apps.users.models import User, UserSerializer, Roles
from .models import Course
from .permissions import CourseUserPermissions


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, CourseUserPermissions]

    def perform_create(self, serializer):
        course = serializer.save()
        user = self.request.user
        user.course.add(course)

    @action(detail=True, methods=['post'])
    def join_course(self, request, *args, **kwargs):
        course = self.get_object()
        user = request.user

        user.course.add(course)
        return Response(status=status.HTTP_200_OK)

    # def leave_course(self, request, *args, **kwargs):
    #     course = self.get_object()
    #     user = request.user
    #
    #     user.course.remove(course)
    #     return Response(status=status.HTTP_200_OK)
    # TODO implement leave_course (dont forget to leave all groups as well)

    @action(detail=False, methods=['GET'])
    def get_selected_courses(self, request, *args, **kwargs):
        user = request.user
        courses = user.course.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['GET'])
    def get_projects(self, request, *args, **kwargs):
        course = self.get_object()
        projects = Project.objects.filter(course_id=course)
        return Response(ProjectSerializer(projects, many=True).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['GET'])
    def get_teachers(self, request, *args, **kwargs):
        course = self.get_object()
        teachers = User.objects.filter(course=course, role__in=[Roles.TEACHER, Roles.ADMIN])
        return Response(UserSerializer(teachers, many=True).data, status=status.HTTP_200_OK)
