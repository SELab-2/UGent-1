from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from backend.pigeonhole.apps.users.models import User
from .models import Course, CourseSerializer
from .permissions import CourseUserPermissions


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, CourseUserPermissions]

    def create(self, request, *args, **kwargs):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        course_id = kwargs.get('pk')
        course = Course.objects.get(pk=course_id)
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        course_id = kwargs.get('pk')
        course = Course.objects.get(pk=course_id)
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def list(self, request, *args, **kwargs):
        if request.user.is_admin or request.user.is_superuser
            serializer = CourseSerializer(self.queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        if request.user.is_teacher or request.user.is_student:
            courses = User.objects.get(id=request.user.id).course.all()
            serializer = CourseSerializer(courses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        serializer = CourseSerializer(self.queryset, many=True)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        course_id = kwargs.get('pk')
        course = Course.objects.get(pk=course_id)
        serializer = CourseSerializer(course, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        course_id = kwargs.get('pk')
        course = Course.objects.get(pk=course_id)
        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def join_course(self, request, *args, **kwargs):
        course_id = kwargs.get('pk')
        course = Course.objects.get(pk=course_id)
        user = User.objects.get(id=request.user.id)
        user.course.add(course)
        return Response(status=status.HTTP_200_OK)

