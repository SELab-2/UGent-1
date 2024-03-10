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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        course_id = kwargs.get('course_id')
        project_id = kwargs.get('pk')

        serializer = ProjectSerializer(instance=Project.objects.get(pk=project_id), many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        print("ceating new project")
        course_id = kwargs.get('course_id')
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
        return Response({"message": "Project has been deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

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
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
