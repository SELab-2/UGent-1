import zipfile
import shutil
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

import os


class ZipUtilities:

    def toZip(self, folderpaths, zip_path):
        zip_file = zipfile.ZipFile(zip_path, 'w')

        for folder_path in folderpaths:
            if os.path.isfile(folder_path):
                zip_file.write(folder_path)
            else:
                self.addFolderToZip(zip_file, folder_path)
        zip_file.close()

    def addFolderToZip(self, zip_file, folder):
        for file in os.listdir(folder):
            full_path = os.path.join(folder, file)
            if os.path.isfile(full_path):
                zip_file.write(full_path)
            elif os.path.isdir(full_path):
                self.addFolderToZip(zip_file, full_path)


def submission_folder_path(group_id, submission_id):
    return f"{str(settings.STATIC_ROOT)}/submissions/group_{group_id}/{submission_id}"


# TODO test timestamp, file, output_test
def submission_file_path(group_id, submission_id, relative_path):
    return submission_folder_path(group_id, submission_id) + '/' + relative_path


class SubmissionsViewset(viewsets.ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    permission_classes = [IsAuthenticated & CanAccessSubmission]
    pagination_class = CustomPageNumberPagination
    filter_backends = [OrderingFilter, DjangoFilterBackend]

    def create(self, request, *args, **kwargs):

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
                filepathstring = submission_file_path(
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

    @action(detail=True, methods=["get"])
    def download(self, request, *args, **kwargs):
        submission = self.get_object()
        if submission is None:
            return Response(
                {"message": f"Submission with id {id} not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        archivename = "submission_" + str(submission.submission_id)
        downloadspath = 'backend/downloads/'
        submission_path = submission_folder_path(submission.group_id.group_id, submission.submission_id)

        shutil.make_archive(downloadspath + archivename, 'zip', submission_path)

        path = realpath(downloadspath + archivename + '.zip')
        response = FileResponse(
            open(path, 'rb'),
            content_type="application/force-download"
        )
        response['Content-Disposition'] = f'inline; filename={basename(path)}'

        return response

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

            submission_folders = []

            for sid in ids:
                submission = Submissions.objects.get(submission_id=sid)
                if submission is None:
                    return Response(
                        {"message": f"Submission with id {id} not found"},
                        status=status.HTTP_404_NOT_FOUND
                    )
                submission_folders.append(
                    submission_folder_path(
                        submission.group_id.group_id, submission.submission_id
                        )
                    )

            utilities = ZipUtilities()
            filename = path
            utilities.toZip(submission_folders, filename)

        path = realpath(path)
        response = FileResponse(
            open(path, 'rb'),
            content_type="application/force-download"
        )
        response['Content-Disposition'] = f'inline; filename={basename(path)}'

        return response
