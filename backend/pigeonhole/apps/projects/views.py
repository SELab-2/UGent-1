from django.db import transaction
from rest_framework import status
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.groups.models import GroupSerializer
from backend.pigeonhole.apps.submissions.models import Submissions, SubmissionsSerializer
from .models import Project, ProjectSerializer
from .permissions import CanAccessProject


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10  # Set the default page size here
    page_size_query_param = "page_size"
    max_page_size = 100


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated & CanAccessProject]
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    pagination_class = CustomPageNumberPagination

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        number_of_groups = serializer.validated_data.get("number_of_groups", 0)
        project = serializer.save()

        groups = []
        for i in range(number_of_groups):
            group_data = {
                "project_id": project.project_id,
                "user": [],  # You may add users here if needed
                "feedback": None,
                "final_score": None,
                "visible": False,  # Adjust visibility as needed
            }
            group_serializer = GroupSerializer(data=group_data)
            group_serializer.is_valid(raise_exception=True)
            groups.append(group_serializer.save())

        # You may return the newly created groups if needed
        groups_data = GroupSerializer(groups, many=True).data
        response_data = serializer.data
        response_data["groups"] = groups_data

        headers = self.get_success_headers(serializer.data)
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=["get"])
    def get_groups(self, request, *args, **kwargs):
        project = self.get_object()
        groups = Group.objects.filter(project_id=project)
        page_size = request.query_params.get(
            "page_size", self.pagination_class.page_size
        )

        paginator = CustomPageNumberPagination()
        paginator.page_size = page_size
        paginator.page_query_param = "page"
        paginator.page_size_query_param = "page_size"
        paginator.max_page_size = 100

        paginated_groups = paginator.paginate_queryset(groups, request)
        serializer = GroupSerializer(paginated_groups, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(detail=True, methods=['get'])
    def get_submissions(self, request, *args, **kwargs):
        project = self.get_object()
        groups = Group.objects.filter(project_id=project)
        submissions = Submissions.objects.filter(group_id__in=groups)
        return Response(SubmissionsSerializer(submissions, many=True).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def get_last_submission(self, request, *args, **kwargs):
        project = self.get_object()
        groups = Group.objects.filter(project_id=project)
        submissions = Submissions.objects.filter(group_id__in=groups).order_by('-timestamp')
        return Response(SubmissionsSerializer(submissions.first()).data, status=status.HTTP_200_OK)