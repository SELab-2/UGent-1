from rest_framework import permissions
from backend.pigeonhole.apps.users.models import Student, Teacher


class CourseUserPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if isinstance(request.user, Teacher):
            return True

        if isinstance(request.user, Student):
            return view.action in ['list', 'retrieve']

        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        if isinstance(request.user, Teacher):
            if request.user.is_admin:
                return True
            elif Teacher.objects.filter(id=request.user.id, course=obj).exists():
                return True
            return view.action in ['list', 'retrieve']

        if isinstance(request.user, Student):
            return view.action in ['list', 'retrieve']

        return False
