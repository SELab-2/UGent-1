from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.submissions.models import Submissions, SubmissionsSerializer
from backend.pigeonhole.apps.submissions.permissions import CanAccessSubmission


# TODO test timestamp, file, output_test


class SubmissionsViewset(viewsets.ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    permission_classes = [IsAuthenticated & CanAccessSubmission]

    @action(detail=False, methods=['GET'])
    def get_all_submissions(self, request, *args, **kwargs):
        user = request.user
        groups = Group.objects.filter(users=user)
        submissions = Submissions.objects.filter(group_id__in=groups)
        if not submissions:
            return Response({"message": "No submissions found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(SubmissionsSerializer(submissions, many=True).data, status=status.HTTP_200_OK)
