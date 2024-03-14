from datetime import datetime

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.pigeonhole.apps.submissions.models import Submissions, SubmissionsSerializer
from backend.pigeonhole.apps.submissions.permissions import CanAccessSubmission


# TODO test timestamp, file, output_test


class SubmissionsViewset(viewsets.ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    permission_classes = [IsAuthenticated & CanAccessSubmission]

    @action(detail=False, methods=['POST'])
    def submit(self, request, *args, **kwargs):
        submission = self.get_submission()
        serializer = SubmissionsSerializer(submission, data=request.data)
        serializer.is_valid(raise_exception=True)

        group = Group.objects.get(id=serializer.group_id)
        if not group:
            return Response({"message": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

        project = Project.objects.get(id=group.project_id)
        if not project:
            return Response({"message": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

        if datetime.now() > project.deadline:
            return Response({"message": "Deadline expired"}, status=status.HTTP_410_GONE)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
