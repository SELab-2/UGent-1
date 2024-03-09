from rest_framework import permissions
from backend.pigeonhole.apps.users.models import Student, Teacher


class CourseUserPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.is_admin:
            return True

        if request.user.is_teacher:
            return True

        if request.user.is_student:
            return view.action in ['list', 'retrieve']

        return False

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False

        if request.user.is_admin:
            return True

        if request.user.is_teacher:
            return Teacher.objects.filter(id=request.user.id, course=obj).exists()

        if request.user.is_student:
            return Student.objects.filter(id=request.user.id, course=obj).exists() and view.action in ['list', 'retrieve']

        return False
