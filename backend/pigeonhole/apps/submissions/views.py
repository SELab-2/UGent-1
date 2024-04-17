from datetime import datetime
import pytz

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

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

def submission_file_url(project_id, group_id, submission_id, relative_path):
    return (f"{str(settings.STATIC_ROOT)}/submissions/project_{project_id}"
            f"/group_{group_id}/{submission_id}/{relative_path}")


class SubmissionsViewset(viewsets.ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    permission_classes = [IsAuthenticated & CanAccessSubmission]
    pagination_class = CustomPageNumberPagination
    filter_backends = [OrderingFilter, DjangoFilterBackend]

    def create(self, request, *args, **kwargs):
        project_id = request.data['project_id']
        request.data._mutable = True  # epic hack
        if 'group_id' not in request.data:
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
                    project_id, group_id, str(serializer.data['submission_id']), relative_path)
                filepath = Path(filepathstring)
                filepath.parent.mkdir(parents=True, exist_ok=True)
                with open(filepathstring, 'wb+') as dest:
                    for chunk in file.chunks():
                        dest.write(chunk)
                #submission.file_urls = '[el path]'
        except IOError as _:
            return Response({"message": "Error uploading files"}
                            , status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
