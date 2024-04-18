import zipfile
from os.path import basename, realpath

from django.db import transaction
from django.http import FileResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.groups.models import GroupSerializer
from backend.pigeonhole.apps.submissions.models import (
    Submissions,
    SubmissionsSerializer,
)
from backend.pigeonhole.filters import (
    GroupFilter,
    CustomPageNumberPagination,
    SubmissionFilter,
)
from .models import Project, ProjectSerializer
from .permissions import CanAccessProject


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated & CanAccessProject]
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    pagination_class = CustomPageNumberPagination
    filter_backends = [OrderingFilter, DjangoFilterBackend]

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

    @action(detail=True, methods=["GET"])
    def get_groups(self, request, *args, **kwargs):
        project = self.get_object()
        groups = Group.objects.filter(project_id=project)
        groups_filter = GroupFilter(request.GET, queryset=groups)
        filtered_groups = groups_filter.qs
        page_size = request.query_params.get(
            "page_size", self.pagination_class.page_size
        )
        paginator = CustomPageNumberPagination()
        paginator.page_size = page_size
        paginator.page_query_param = "page"
        paginator.page_size_query_param = "page_size"
        paginator.max_page_size = 100
        paginated_groups = paginator.paginate_queryset(filtered_groups, request)
        serializer = GroupSerializer(paginated_groups, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(detail=True, methods=["get"])
    def get_submissions(self, request, *args, **kwargs):
        project = self.get_object()
        groups = Group.objects.filter(project_id=project)
        submissions = Submissions.objects.filter(group_id__in=groups)
        submissions_filter = SubmissionFilter(request.GET, queryset=submissions)
        filtered_submissions = submissions_filter.qs
        paginator = CustomPageNumberPagination()
        paginated_submissions = paginator.paginate_queryset(
            filtered_submissions, request
        )
        serializer = SubmissionsSerializer(paginated_submissions, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(detail=True, methods=["get"])
    def get_last_submission(self, request, *args, **kwargs):
        project = self.get_object()
        groups = Group.objects.filter(project_id=project)
        submissions = Submissions.objects.filter(group_id__in=groups).order_by(
            "-timestamp"
        )
        return Response(
            SubmissionsSerializer(submissions.first()).data, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["get"])
    def download_submissions(self, request, *args, **kwargs):
        project = self.get_object()
        groups = Group.objects.filter(project_id=project)
        submissions = Submissions.objects.filter(group_id__in=groups)

        if len(submissions) == 0:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        path = ""

        if len(submissions) == 1:
            path = submissions[0].file.path

        else:
            path = "backend/downloads/submissions.zip"
            zipf = zipfile.ZipFile(file=path, mode="w", compression=zipfile.ZIP_STORED)

            for submission in submissions:
                zipf.write(
                    filename=submission.file.path,
                    arcname=basename(submission.file.path),
                )

            zipf.close()

        path = realpath(path)
        response = FileResponse(
            open(path, "rb"), content_type="application/force-download"
        )
        response["Content-Disposition"] = f"inline; filename={basename(path)}"

        return response

    @action(detail=True, methods=["get"])
    def download_testfiles(self, request, *args, **kwargs):
        project = self.get_object()

        path = realpath(project.test_files.path)
        response = FileResponse(
            open(path, "rb"), content_type="application/force-download"
        )
        response["Content-Disposition"] = f"inline; filename={basename(path)}"

        return response
