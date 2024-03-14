from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from backend.pigeonhole.apps.users.models import User, UserSerializer
from .permissions import UserPermissions


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, UserPermissions]
