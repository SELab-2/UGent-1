from rest_framework import permissions
from backend.pigeonhole.apps.users.models import User


class CourseUserPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True

        if Teacher.objects.filter(id=request.user.id).exists():
            teacher = Teacher.objects.get(id=request.user.id)
            if teacher.is_admin:
                return True
            # Check if the teacher is assigned to the course
            course = view.kwargs.get('pk')
            if teacher.course.filter(course_id=course).exists():
                return True
            return view.action in ['list', 'retrieve', 'create']
        elif Student.objects.filter(id=request.user.id).exists():
            return view.action in ['list', 'retrieve']
        return False
