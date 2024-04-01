from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from backend.pigeonhole.apps.users.models import User, UserSerializer
from .permissions import UserPermissions


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, UserPermissions]

    def get_object(self):
        pk = self.kwargs.get('pk')

        if pk == "current":
            return self.request.user

        return super().get_object()