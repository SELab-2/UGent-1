from rest_framework import permissions
from backend.pigeonhole.apps.users.models import Teacher, Student


class CanAccessProject(permissions.BasePermission):
    # Custom permission class to determine if the currect user has access
    # to the project data.
    def has_permission(self, request, view):
        user = request.user
        subject_id = view.kwargs.get('course_id')
        # If the user is a teacher, grant access.
        if isinstance(user, Teacher):
            if user.course.filter(id=subject_id).exists():
                return True
        elif isinstance(user, Teacher) and user.is_admin:
            return True
        # If the user is a student, grant access only to their own projects.
        elif isinstance(user, Student):
            if user.course.filter(id=subject_id).exists():
                return True
        elif request.user.is_superuser:
            return True
        return False
