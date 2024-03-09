from rest_framework import permissions


class CanAccessProject(permissions.BasePermission):
    # Custom permission class to determine if the currect user has access
    # to the project data.
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            # If the user is a teacher, grant access
            if request.user.teacher or request.user.teacher.is_admin:
                return True
            # If the user is a student, grant access only to their own projects
            elif request.user.student:
                subject_id = view.kwargs.get('subject_id')
                project_id = view.kwargs.get('pk')
                # TODO check if the student is subscribed to project
                student = request.user.student
                if student.course.filter(id=subject_id).exists():
                    return True
        return False
