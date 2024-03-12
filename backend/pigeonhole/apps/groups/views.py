from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group, GroupSerializer
from backend.pigeonhole.apps.projects.models import Project
from .permission import CanAccessGroup


# TODO tests for score/max_score
# TODO bij de update/partial update zorgen dat de user bestaat, anders errors

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

    def retrieve(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('project_id')
        group_nr = kwargs.get('group_nr')

        # Check whether the course exists
        get_object_or_404(Course, course_id=course_id)
        # Check whether the project exists
        get_object_or_404(Project, pk=project_id)
        group = get_object_or_404(Group, project_id=project_id, group_nr=group_nr)
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
        group_nr = kwargs.get('group_nr')
        get_object_or_404(Course, course_id=course_id)
        get_object_or_404(Project, project_id=project_id)
        group = get_object_or_404(Group, group_nr=group_nr, project_id=project_id)
        serializer = GroupSerializer(instance=group, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('project_id')
        group_nr = kwargs.get('group_nr')
        get_object_or_404(Course, course_id=course_id)
        get_object_or_404(Project, project_id=project_id)
        group = get_object_or_404(Group, group_nr=group_nr, project_id=project_id)
        serializer = GroupSerializer(instance=group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        return Response({"message": "You can't create groups"}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        return Response({"message": "You can't delete groups"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def join_group(self, request, *args, **kwargs):
        # TODO hier nog checks toevoegen, maar je kan een group joinen
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('project_id')
        group_nr = kwargs.get('group_nr')
        get_object_or_404(Course, course_id=course_id)
        get_object_or_404(Project, project_id=project_id)
        group = get_object_or_404(Group, project_id=project_id, group_nr=group_nr)

        group.user.add(request.user)
        return Response(status=status.HTTP_200_OK)
