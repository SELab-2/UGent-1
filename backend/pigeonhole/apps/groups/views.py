from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.pigeonhole.apps.groups.models import Group, GroupSerializer
from backend.pigeonhole.apps.submissions.models import Submissions, SubmissionsSerializer
from .permission import CanAccessGroup
from ..projects.models import Project


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated and CanAccessGroup]

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        group_id = pk
        group = Group.objects.get(group_id=group_id)
        user = request.user
        project = Project.objects.get(project_id=group.project_id.project_id)
        if group.user.count() < project.group_size:
            group.user.add(user)
            group.save()
            return Response({'message': 'User joined group'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Group is full'}, status=status.HTTP_400_BAD_REQUEST)

    # leave a group
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        group = self.get_object()
        user = request.user
        group.user.remove(user)
        group.save()
        return Response({'message': 'User left group'}, status=status.HTTP_200_OK)

    # get all submissions for a group
    @action(detail=True, methods=['get'])
    def get_submissions(self, request, pk=None):
        group = self.get_object()
        submissions = Submissions.objects.filter(group_id=group.group_id)
        return Response(SubmissionsSerializer(submissions, many=True).data, status=status.HTTP_200_OK)
