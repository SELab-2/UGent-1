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

    """
    def list(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('project_id')

        # Check whether the course exists
        get_object_or_404(Course, course_id=course_id)
        # Check whether the project exists
        project = get_object_or_404(Project, project=project_id)

        # Ensure the project is associated with the course
        if project.course_id != int(course_id):
            return Response({'detail': 'Project not found in the specified course.'}, status=status.HTTP_404_NOT_FOUND)

        queryset = self.queryset.filter(project_id=project_id)
        serializer = self.get_serializer(queryset, many=True)

        if request.user.is_student:
            for group in serializer.data:
                if request.user.id not in group["users"]:
                    del group["final_score"]
                    del group["feedback"]

        return Response(serializer.data, status=status.HTTP_200_OK)
    """

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        group = self.get_object()
        user = request.user
        if group.members.count() < group.project.max_group_size:
            group.members.add(user)
            group.save()
            return Response({'message': 'User joined group'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Group is full'}, status=status.HTTP_400_BAD_REQUEST)

    # leave a group
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        group = self.get_object()
        user = request.user
        group.members.remove(user)
        group.save()
        return Response({'message': 'User left group'}, status=status.HTTP_200_OK)
