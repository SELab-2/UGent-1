from rest_framework import permissions
from backend.pigeonhole.apps.users.models import Teacher, Student


class CourseUserPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if Teacher.objects.filter(id=request.user.id).exists():
            return True
        elif Student.objects.filter(id=request.user.id).exists():
            return view.action in ['list', 'retrieve']
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        if Teacher.objects.filter(id=request.user.id).exists():
            if request.user.is_admin:
                return True
            # Check if the teacher is assigned to the course
            elif request.user.course.filter(id=obj.id).exists():
                return True
            return view.action in ['list', 'retrieve']
        elif isinstance(request.user, Student):
            return view.action in ['list', 'retrieve']

        return False


