from rest_framework import permissions
from backend.pigeonhole.apps.users.models import User


class CanAccessProject(permissions.BasePermission):
    # Custom permission class to determine if the currect user has access
    # to the project data.
    def has_permission(self, request, view):
        user = request.user
        course_id = view.kwargs.get('course_id')
        if user.is_student:
            if user.course.filter(course_id=course_id).exists():
                return True
        elif user.is_teacher:
            if user.course.filter(course_id=course_id).exists():
                return True
        elif user.is_admin or user.is_superuser:
            return True
        return False
