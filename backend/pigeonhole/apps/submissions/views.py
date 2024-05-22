import fnmatch
import os
import shutil
import zipfile
from datetime import datetime
from os.path import realpath, basename
from pathlib import Path

import pytz
from django.http import FileResponse
from django.shortcuts import get_object_or_404
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
from .models import submission_folder_path, submission_file_path


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


class SubmissionsViewset(viewsets.ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    permission_classes = [IsAuthenticated & CanAccessSubmission]
    pagination_class = CustomPageNumberPagination
    filter_backends = [OrderingFilter, DjangoFilterBackend]

    def create(self, request, *args, **kwargs):
        group_id = request.data["group_id"]
        group = get_object_or_404(Group, group_id=group_id)
        data = request.data.copy()  # Create a mutable copy
        if len(request.FILES) != 0:
            file_urls = []
            for key in request.FILES:
                file_urls.append(key)
        else:
            file_urls = request.data["file_urls"].split(",")

        serializer = SubmissionsSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        if not group:
            return Response(
                {"message": "Group not found", "errorcode":
                    "ERROR_GROUP_NOT_FOUND"}, status=status.HTTP_404_NOT_FOUND
            )

        project = Project.objects.get(project_id=group.project_id.project_id)
        if not project:
            return Response(
                {"message": "Project not found", "errorcode":
                    "ERROR_PROJECT_NOT_FOUND"}, status=status.HTTP_404_NOT_FOUND
            )

        now_naive = datetime.now().replace(
            tzinfo=pytz.UTC
        )  # Making it timezone-aware in UTC
        if project.deadline and now_naive > project.deadline:
            return Response(
                {"message": "Deadline expired",
                 "errorcode": "ERROR_DEADLINE_EXPIRED"},
                status=status.HTTP_400_BAD_REQUEST
            )

        submission = serializer.save()

        # upload files
        try:
            for relative_path in request.FILES:
                # TODO: fix major security flaw met .. in relative_path
                file = request.FILES[relative_path]
                filepathstring = submission_file_path(
                    group_id, str(serializer.data['submission_id']), relative_path)
                filepath = Path(filepathstring)
                filepath.parent.mkdir(parents=True, exist_ok=True)
                with open(filepathstring, "wb+") as dest:
                    for chunk in file.chunks():
                        dest.write(chunk)
                # submission.file_urls = '[el path]'
                print("Uploaded file: " + filepathstring)
        except IOError as e:
            print(e)
            return Response(
                {"message": "Error uploading files", "errorcode":
                    "ERROR_FILE_UPLOAD"}, status=status.HTTP_400_BAD_REQUEST
            )

        project = Project.objects.get(project_id=group.project_id.project_id)
        # return Response(",".join(file_urls), status=status.HTTP_201_CREATED)
        if project.file_structure is None or project.file_structure == "":
            complete_message = {"message": "Submission successful"}
        else:
            violations = check_restrictions(file_urls, project.file_structure.split(","))

            if not violations[0] and not violations[2]:
                complete_message = {"success": 0}
            else:
                violations.update({'success': 1})
                complete_message = violations

        submission.eval()

        return Response(complete_message, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(detail=True, methods=["get"])
    def download(self, request, *args, **kwargs):
        submission = self.get_object()
        if submission is None:
            return Response(
                {"message": f"Submission with id {id} not found", "errorcode":
                    "ERROR_SUBMISSION_NOT_FOUND"},
                status=status.HTTP_404_NOT_FOUND
            )

        archivename = "submission_" + str(submission.submission_id)
        downloadspath = 'backend/downloads/'
        submission_path = submission_folder_path(submission.group_id.group_id,
                                                 submission.submission_id)

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

        path = ""

        if len(ids) == 1:
            submission = Submissions.objects.get(submission_id=ids[0])
            if submission is None:
                return Response(
                    {"message": f"Submission with id {ids[0]} not found",
                     "errorcode": "ERROR_SUBMISSION_NOT_FOUND"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            path = submission.file.path

        else:
            path = 'backend/downloads/submissions.zip'
            submission_folders = []

            for sid in ids:
                submission = Submissions.objects.get(submission_id=sid)
                if submission is None:
                    return Response(
                        {"message": f"Submission with id {id} not found",
                         "errorcode": "ERROR_SUBMISSION_NOT_FOUND"},
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
            open(path, "rb"), content_type="application/force-download"
        )
        response["Content-Disposition"] = f"inline; filename={basename(path)}"

        return response

    @action(detail=True, methods=["get"])
    def get_project(self, request, *args, **kwargs):
        return Response(
            {"project": self.get_object().group_id.project_id.project_id},
            status=status.HTTP_200_OK
        )


def check_restrictions(filenames, restrictions):
    # 0: Required file not found
    # 1: Required file found
    # 2: Forbidden file found
    # 3: No forbidden file found
    violations = {0: [], 1: [], 2: [], 3: []}
    for restriction_ in restrictions:
        restriction = restriction_.strip()
        if restriction.startswith('+'):
            pattern = restriction[1:]
            matching_files = fnmatch.filter(filenames, pattern)
            if not matching_files:
                violations[0].append(pattern)
            else:
                violations[1].append(pattern)
        elif restriction.startswith('-'):
            pattern = restriction[1:]
            matching_files = fnmatch.filter(filenames, pattern)
            if matching_files:
                violations[2].append(pattern)
            else:
                violations[3].append(pattern)
    return violations
