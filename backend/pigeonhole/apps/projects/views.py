from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.groups.models import GroupSerializer
from .models import Project, ProjectSerializer, Course
from .permissions import CanAccessProject


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated & CanAccessProject]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        number_of_groups = serializer.validated_data.get('number_of_groups', 0)
        project = serializer.save()

        groups = []
        for i in range(number_of_groups):
            group_data = {
                'project_id': project.project_id,
                'user': [],  # You may add users here if needed
                'feedback': None,
                'final_score': None,
                'visible': False,  # Adjust visibility as needed
            }
            group_serializer = GroupSerializer(data=group_data)
            group_serializer.is_valid(raise_exception=True)
            groups.append(group_serializer.save())

        # You may return the newly created groups if needed
        groups_data = GroupSerializer(groups, many=True).data
        response_data = serializer.data
        response_data['groups'] = groups_data

        headers = self.get_success_headers(serializer.data)
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)