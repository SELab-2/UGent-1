from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Project, ProjectSerializer, Course
from backend.pigeonhole.apps.groups.models import Group
from .permissions import CanAccessProject

# TODO hier nog zorgen als een project niet visible is, dat de students het niet kunnen zien.
# TODO tests for visibility and deadline

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated & CanAccessProject]

    def list(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        serializer = ProjectSerializer(Project.objects.filter(course_id=course_id), many=True)

        # Check whether the course exists
        get_object_or_404(Course, course_id=course_id)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')

        if request.user.is_teacher or request.user.is_admin or request.user.is_superuser:
            # Check whether the course exists
            get_object_or_404(Course, course_id=course_id)

            serializer = ProjectSerializer(data=request.data)
            if serializer.is_valid():
                project = serializer.save() # Save the project and get the instance
                # make NUMBER OF GROUP groups
                for i in range(serializer.validated_data['number_of_groups']):
                    group = Group.objects.create(group_nr=i+1, project_id=project) # Assign the Project instance
                    group.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "You are not allowed to create a new project."},
                        status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('pk')

        if request.user.is_teacher or request.user.is_admin or request.user.is_superuser:
            # Check whether the course exists
            get_object_or_404(Course, course_id=course_id)

            # Check whether the project exists
            project = get_object_or_404(Project, pk=project_id)
            project.delete()
            return Response({"message": "Project has been deleted successfully."},
                            status=status.HTTP_204_NO_CONTENT)
        return Response({"message": "You are not allowed to delete this project."},
                        status=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('pk')

        # Check whether the course exists
        get_object_or_404(Course, course_id=course_id)

        # Check whether the project exists
        project = get_object_or_404(Project, pk=project_id)
        serializer = ProjectSerializer(instance=project, many=False)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('pk')

        if request.user.is_teacher or request.user.is_admin or request.user.is_superuser:
            get_object_or_404(Course, course_id=course_id)

            project = get_object_or_404(Project, pk=project_id)
            serializer = ProjectSerializer(project, data=request.data)
            if serializer.is_valid():
                serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "You are not allowed to update this project."},
                        status=status.HTTP_403_FORBIDDEN)

    def partial_update(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('pk')

        if request.user.is_teacher or request.user.is_admin or request.user.is_superuser:
            # Check whether the course exists
            get_object_or_404(Course, course_id=course_id)

            # Check whether the project exists
            project = get_object_or_404(Project, pk=project_id)

            serializer = ProjectSerializer(project, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "You are not allowed to update this project."},
                        status=status.HTTP_403_FORBIDDEN)
