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
