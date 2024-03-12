from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group, GroupSerializer
from backend.pigeonhole.apps.projects.models import Project


# TODO tests for score/max_score


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # TODO zorg dat er geen 2 groepen met hetzelfde nummer kunnen zijn.
        course_id = kwargs.get('course_id')

        if request.user.is_teacher or request.user.is_admin or request.user.is_superuser:
            # Check whether the course exists
            get_object_or_404(Course, course_id=course_id)

            serializer = GroupSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "You are not allowed to create a new group."},
                        status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        serializer = GroupSerializer(self.queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('project_id')
        group_id = kwargs.get('pk')

        # Check whether the course exists
        get_object_or_404(Course, course_id=course_id)

        # Check whether the project exists
        get_object_or_404(Project, pk=project_id)
        group = get_object_or_404(Group, group_id=group_id)

        serializer = GroupSerializer(instance=group, many=False)

        return Response(serializer.data, status=status.HTTP_200_OK)
