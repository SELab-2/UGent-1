from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group, GroupSerializer
from backend.pigeonhole.apps.projects.models import Project


# TODO tests for score/max_score
# TODO bij de update/partial update zorgen dat de user bestaat, anders errors

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

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
        user = request.user
        serializer = GroupSerializer(instance=group, many=False)
        if user.is_superuser or user.is_staff or user.is_teacher:
            serializer = GroupSerializer(instance=group, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif user.is_student:
            return Response(serializer.get_visible_data(), status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('project_id')
        group_id = kwargs.get('pk')
        get_object_or_404(Course, course_id=course_id)
        get_object_or_404(Project, project_id=project_id)
        group = get_object_or_404(Group, group_id=group_id)
        serializer = GroupSerializer(instance=group, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('project_id')
        group_id = kwargs.get('pk')
        get_object_or_404(Course, course_id=course_id)
        get_object_or_404(Project, project_id=project_id)
        group = get_object_or_404(Group, group_id=group_id)
        serializer = GroupSerializer(instance=group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        return Response({"message": "You can't creat groups"}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        return Response({"message": "You can't creat groups"}, status=status.HTTP_400_BAD_REQUEST)
