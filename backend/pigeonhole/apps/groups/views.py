from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from backend.pigeonhole.apps.groups.models import Group, GroupSerializer
from backend.pigeonhole.apps.submissions.models import (
    Submissions,
    SubmissionsSerializer,
)
from .permission import CanAccessGroup
from ..projects.models import Project


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10  # Set the default page size here
    page_size_query_param = "page_size"
    max_page_size = 100


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated and CanAccessGroup]
    pagination_class = CustomPageNumberPagination

    @action(detail=True, methods=["post"])
    def join(self, request, pk=None):
        group_id = pk
        group = Group.objects.get(group_id=group_id)
        user = request.user
        project = Project.objects.get(project_id=group.project_id.project_id)
        if group.user.count() < project.group_size:
            group.user.add(user)
            group.save()
            return Response({"message": "User joined group"}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "Group is full"}, status=status.HTTP_400_BAD_REQUEST
            )

    # leave a group
    @action(detail=True, methods=["post"])
    def leave(self, request, pk=None):
        group = self.get_object()
        user = request.user
        group.user.remove(user)
        group.save()
        return Response({"message": "User left group"}, status=status.HTTP_200_OK)

    # get all submissions for a group
    @action(detail=True, methods=["get"])
    def get_submissions(self, request, pk=None):
        group = self.get_object()

        # Retrieve the page size from the request query parameters
        page_size = request.query_params.get(
            "page_size", self.pagination_class.page_size
        )

        # Filter submissions queryset by group_id
        submissions = Submissions.objects.filter(group_id=group.group_id)

        # Paginate the queryset
        paginator = CustomPageNumberPagination()
        paginator.page_size = page_size
        paginator.page_query_param = "page"
        paginator.page_size_query_param = "page_size"
        paginator.max_page_size = 100

        paginated_submissions = paginator.paginate_queryset(submissions, request)

        # Serialize paginated submissions and return response
        serializer = SubmissionsSerializer(paginated_submissions, many=True)
        return paginator.get_paginated_response(serializer.data)
