from rest_framework import permissions
from backend.pigeonhole.apps.users.models import Teacher, Student


class CanAccessProject(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        subject_id = view.kwargs.get('course_id')

        if Teacher.objects.filter(id=user.id).exists():
            teacher = Teacher.objects.get(id=user.id)

            # Check if the teacher is assigned to the specified course
            if teacher.course.filter(course_id=subject_id).exists():
                return True
            elif teacher.is_admin:
                return True
            return view.action in ['list', 'retrieve', 'create'] and teacher.course.filter(
                course_id=subject_id).exists()
        # If the user is a student, grant access only to their own projects.
        elif Student.objects.filter(id=user.id).exists():
            student = Student.objects.get(id=user.id)
            if student.course.filter(course_id=subject_id).exists():
                return view.action in ['list', 'retrieve']
        elif request.user.is_superuser:
            return True
        return False
