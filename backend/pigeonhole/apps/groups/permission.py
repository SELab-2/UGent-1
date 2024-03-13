from rest_framework import permissions


class CanAccessGroup(permissions.BasePermission):
    # Custom user class to check if the user can join a group.
    def has_permission(self, request, view):
        user = request.user
        course_id = view.kwargs.get('course_id')
        if user.is_admin or user.is_superuser:
            return True
        elif user.is_teacher:
            if user.course.filter(course_id=course_id).exists():
                return view.action in ['retrieve', 'get_submissions']
        elif user.is_student:
            if user.course.filter(course_id=course_id).exists():
                return view.action in ['retrieve', 'join',
                                       'leave', 'get_submissions']
        return False
