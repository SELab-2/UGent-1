import zipfile
from datetime import datetime
from os.path import realpath, basename

import pytz
from django.http import FileResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.submissions.models import (
    Submissions,
    SubmissionsSerializer,
)
from backend.pigeonhole.apps.submissions.permissions import CanAccessSubmission
from backend.pigeonhole.filters import CustomPageNumberPagination

from django.conf import settings
from pathlib import Path
import json as JSON


# TODO test timestamp, file, output_test
def submission_file_url(group_id, submission_id, relative_path):
    return (f"{str(settings.STATIC_ROOT)}/submissions"
            f"/group_{group_id}/{submission_id}/{relative_path}")


class SubmissionsViewset(viewsets.ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    permission_classes = [IsAuthenticated & CanAccessSubmission]
    pagination_class = CustomPageNumberPagination
    filter_backends = [OrderingFilter, DjangoFilterBackend]

    def create(self, request, *args, **kwargs):
        request.data._mutable = True  # epic hack
        if 'group_id' not in request.data:
            project_id = request.data['project_id']
            group = Group.objects.filter(project_id=project_id, user=request.user).first()
            group_id = group.group_id
            request.data['group_id'] = group_id
        else:
            group_id = request.data['group_id']
            group = Group.objects.get(group_id=group_id)

        request.data['file_urls'] = JSON.dumps([key for key in request.FILES])

        serializer = SubmissionsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

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

        serializer.save()

        # upload files
        try:
            for relative_path in request.FILES:
                # TODO: fix major security flaw met .. in relative_path
                file = request.FILES[relative_path]
                filepathstring = submission_file_url(
                    group_id, str(serializer.data['submission_id']), relative_path)
                filepath = Path(filepathstring)
                filepath.parent.mkdir(parents=True, exist_ok=True)
                with open(filepathstring, 'wb+') as dest:
                    for chunk in file.chunks():
                        dest.write(chunk)
                # submission.file_urls = '[el path]'
        except IOError as e:
            print(e)
            return Response({"message": "Error uploading files"},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(detail=False, methods=["get"])
    def download_selection(self, request, *args, **kwargs):
        ids = request.query_params.getlist("id", None)

        if not ids:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        path = ''

        if len(ids) == 1:
            submission = Submissions.objects.get(submission_id=ids[0])
            if submission is None:
                return Response(
                    {"message": f"Submission with id {ids[0]} not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            path = submission.file.path

        else:
            path = 'backend/downloads/submissions.zip'
            zipf = zipfile.ZipFile(
                file=path,
                mode="w",
                compression=zipfile.ZIP_STORED
            )

            for id in ids:
                submission = Submissions.objects.get(submission_id=id)
                if submission is None:
                    return Response(
                        {"message": f"Submission with id {id} not found"},
                        status=status.HTTP_404_NOT_FOUND
                    )

                zipf.write(
                    filename=submission.file.path,
                    arcname=basename(submission.file.path)
                )

            zipf.close()

        path = realpath(path)
        response = FileResponse(
            open(path, 'rb'),
            content_type="application/force-download"
        )
        response['Content-Disposition'] = f'inline; filename={basename(path)}'

        return response
