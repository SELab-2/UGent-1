from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.pigeonhole.apps.groups.models import Group
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
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)