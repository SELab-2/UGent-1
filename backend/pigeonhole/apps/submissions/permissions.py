from rest_framework import permissions


class CanAccessSubmission(permissions.BasePermission):
    # Custom permission class to determine if the currect user has access
    # to the submission data.
    def has_permission(self, request, view):
        user = request.user
        submission_id = view.kwargs.get('submission_id')
        if user.is_admin or user.is_superuser:
            return True
        elif user.is_teacher:
            if user.submission.filter(submission_id=submission_id).exists():
                return True
        elif user.is_student:
            if user.submission.filter(submission_id=submission_id).exists():
                return view.action in ['list', 'retrieve']
        return False
