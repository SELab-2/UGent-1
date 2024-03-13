from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.pigeonhole.apps.courses.models import CourseSerializer
from .models import Course
from .permissions import CourseUserPermissions


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, CourseUserPermissions]

    @action(detail=True, methods=['post'])
    def join_course(self, request, *args, **kwargs):
        course = self.get_object()
        user = request.user

        user.course.add(course)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'])
    def get_selected_courses(self, request, *args, **kwargs):
        user = request.user
        courses = user.course.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
