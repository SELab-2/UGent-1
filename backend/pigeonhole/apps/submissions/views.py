from datetime import datetime
import pytz

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.submissions.models import (
    Submissions,
    SubmissionsSerializer,
)
from backend.pigeonhole.apps.submissions.permissions import CanAccessSubmission


# TODO test timestamp, file, output_test


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10  # Set the default page size here
    page_size_query_param = "page_size"
    max_page_size = 100


class SubmissionsViewset(viewsets.ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    permission_classes = [IsAuthenticated & CanAccessSubmission]
    pagination_class = CustomPageNumberPagination

    def create(self, request, *args, **kwargs):
        serializer = SubmissionsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        group_id = serializer.data["group_id"]
        group = Group.objects.get(group_id=group_id)
        if not group:
            return Response(
                {"message": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        project = Project.objects.get(project_id=group.project_id.project_id)
        if not project:
            return Response(
                {"message": "Project not found"}, status=status.HTTP_404_NOT_FOUND
            )

        now_naive = datetime.now().replace(
            tzinfo=pytz.UTC
        )  # Making it timezone-aware in UTC
        if project.deadline and now_naive > project.deadline:
            return Response(
                {"message": "Deadline expired"}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
