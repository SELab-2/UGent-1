from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Project, ProjectSerializer
from .permissions import CanAccessProject


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated & CanAccessProject]

    def create(self, request, *args, **kwargs):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('pk')
        project = Project.objects.get(pk=project_id)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def retrieve(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('pk')

        serializer = ProjectSerializer(instance=Project.objects.get(pk=project_id), many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('pk')
        project = Project.objects.get(pk=project_id)
        serializer = ProjectSerializer(project, data=request.data)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def archive(self, request, *args, **kwargs):
        # Not sure what to do here yet
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('pk')
        serializer = ProjectSerializer(instance=Project.objects.get(pk=project_id), many=False)
        return Response(serializer, status=status.HTTP_200_OK)
