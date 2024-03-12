from rest_framework import permissions

from backend.pigeonhole.apps.users.models import User


class UserPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_admin or request.user.is_superuser:
            return True  # TODO can admins destroy each other?

        if request.user.is_teacher or request.user.is_student:
            if view.action in ['list', 'retrieve']:  # TODO: can teachers create and destroy users?
                return True
            elif view.action in ['update', 'partial_update', 'destroy'] and User.objects.filter(
                    id=request.user.id).exists():
                return True

        return False
