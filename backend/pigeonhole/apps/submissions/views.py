from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from backend.pigeonhole.apps.submissions.models import Submissions, SubmissionsSerializer
from backend.pigeonhole.apps.submissions.permissions import CanAccessSubmission


# TODO test timestamp, file, output_test


class SubmissionsViewset(viewsets.ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    permission_classes = [IsAuthenticated & CanAccessSubmission]

    @property
    def allowed_methods(self):
        if self.request.user.is_student:
            return ['GET', 'POST']
        else:
            return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

    def list(self, request, *args, **kwargs):
        if request.user.is_student:
            self.queryset = Submissions.objects.filter(group_id__members=request.user)
        return super().list(request, *args, **kwargs)
