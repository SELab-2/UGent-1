from rest_framework import permissions

from backend.pigeonhole.apps.users.models import User


class CourseUserPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_admin or request.user.is_superuser:
            return True

        if request.user.is_teacher:
            if view.action in ['create', 'list', 'retrieve']:
                return True
            elif view.action in ['update', 'partial_update', 'destroy'] and User.objects.filter(id=request.user.id,
                                                                                                course=view.kwargs[
                                                                                                    'pk']).exists():
                return True
            return

        if request.user.is_student:
            return view.action in ['list', 'retrieve']

        return False