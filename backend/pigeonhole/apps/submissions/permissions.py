from rest_framework import permissions


class CanAccessSubmission(permissions.BasePermission):
    # Custom permission class to determine if the currect user has access
    # to the submission data.
    def has_permission(self, request, view):
        user = request.user
        group_id = view.kwargs.get('group_id')
        project_id = view.kwargs.get("project_id")
        course_id = view.kwargs.get("course_id")
        if user.is_admin or user.is_superuser:
            return True
        elif user.is_teacher:
            course = Course.objects.get(course_id=course_id)
            project = Project.objects.get(project_id=project_id)
            if course.teachers.filter(user=user).exists() and project.course_id == course:
                return True
        elif user.is_student:
            group = Group.objects.get(group_id=group_id)
            if group.users.filter(user=user).exists():
                return view.action in ['list', 'retrieve', 'create']
        return False
