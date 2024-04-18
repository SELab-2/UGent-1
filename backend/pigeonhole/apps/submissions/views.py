import zipfile
from datetime import datetime
from os.path import basename, realpath

import pytz
from django.http import FileResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project, ProjectSerializer
from backend.pigeonhole.apps.submissions.models import Submissions, SubmissionsSerializer
from backend.pigeonhole.apps.submissions.permissions import CanAccessSubmission


# TODO test timestamp, file, output_test


class SubmissionsViewset(viewsets.ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    permission_classes = [IsAuthenticated & CanAccessSubmission]

    def create(self, request, *args, **kwargs):
        serializer = SubmissionsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        group_id = serializer.data['group_id']
        group = Group.objects.get(group_id=group_id)
        if not group:
            return Response({"message": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

        project = Project.objects.get(project_id=group.project_id.project_id)
        if not project:
            return Response({"message": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

        now_naive = datetime.now().replace(tzinfo=pytz.UTC)  # Making it timezone-aware in UTC
        if project.deadline and now_naive > project.deadline:
            return Response({"message": "Deadline expired"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(detail=True, methods=["get"])
    def get_project(self, request, *args, **kwargs):
        submission = self.get_object()
        group = submission.group_id
        project = group.project_id

        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

    @action(detail=True, methods=["get"])
    def download(self, request, *args, **kwargs):
        submission = self.get_object()
        path = realpath(submission.file.path)
        response = FileResponse(
            open(path, 'rb'),
            content_type="application/force-download"
        )
        response['Content-Disposition'] = f'inline; filename={basename(path)}'
        return response
