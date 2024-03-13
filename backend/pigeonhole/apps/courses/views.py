from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Course
from .permissions import CourseUserPermissions
from backend.pigeonhole.apps.courses.models import CourseSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()  # Add this line to specify the queryset
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

    def get_queryset(self):
        if self.action == 'list':
            return Course.objects.all()
        elif self.action == 'get_selected_courses':
            return self.request.user.course.all()
        return Course.objects.none()
