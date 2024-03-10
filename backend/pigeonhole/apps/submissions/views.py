from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from backend.pigeonhole.apps.submissions.models import Submissions, SubmissionsSerializer


class SubmissionsViewset(viewsets.ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        serializer = SubmissionsSerializer(self.queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
