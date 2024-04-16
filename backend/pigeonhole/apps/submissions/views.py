from datetime import datetime
import pytz

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action, api_view

from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.submissions.models import Submissions, SubmissionsSerializer
from backend.pigeonhole.apps.submissions.permissions import CanAccessSubmission

from django.conf import settings
from pathlib import Path


# TODO test timestamp, file, output_test


class SubmissionsViewset(viewsets.ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    permission_classes = [IsAuthenticated & CanAccessSubmission]

    def create(self, request, *args, **kwargs):
        serializer = SubmissionsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

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

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(detail=True, methods=['PUT'])
    def upload(self, request, *args, **kwargs):
        submission = self.get_object()

        print(request.FILES)

        for relative_path in request.FILES:
            #TODO: fix major security flaw met .. in relative_path
            file = request.FILES[relative_path]
            filepathstring = f"{str(settings.STATIC_ROOT)}/submissons/{str(submission.submission_id)}/{relative_path}"
            filepath = Path(filepathstring)
            filepath.parent.mkdir(parents=True, exist_ok=True)
            with open(filepathstring, 'wb+') as dest:
                for chunk in file.chunks():
                    dest.write(chunk)
            submission.file_urls = '[el path]'
            submission.save()

        return Response(status=status.HTTP_200_OK)


