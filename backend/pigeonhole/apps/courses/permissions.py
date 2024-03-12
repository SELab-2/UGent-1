from rest_framework import permissions
from backend.pigeonhole.apps.users.models import User


class CourseUserPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_admin or request.user.is_superuser:
            return True
        
        if request.user.is_teacher:
            return True

        if request.user.is_student or request.user.is_teacher:
            return view.action in ['list', 'retrieve']

        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_admin or request.user.is_superuser:
            return True
        if request.user.is_teacher:
            if User.objects.filter(id=request.user.id, course=obj).exists():
                return True
            return view.action in ['list', 'retrieve']

        if request.user.is_student:
            return view.action in ['list', 'retrieve']

        return False