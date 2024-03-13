from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.groups.models import Group, GroupSerializer
from .permission import CanAccessGroup

from django.shortcuts import get_object_or_404


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated and CanAccessGroup]
    lookup_field = 'group_nr'

    def list(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('project_id')
        # Check whether the course exists
        get_object_or_404(Course, course_id=course_id)
        # Check whether the project exists
        get_object_or_404(Project, pk=project_id)

        queryset = self.queryset.filter(project_id=project_id)
        serializer = self.get_serializer(queryset, many=True)
        if request.user.is_student:
            for group in serializer.data:
                print(request.user.id)
                if request.user.id not in group["user"]:
                    del group["final_score"]
                    del group["feedback"]
        return Response(serializer.data, status=status.HTTP_200_OK)