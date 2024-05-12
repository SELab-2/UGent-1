from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import APIException

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.submissions.models import Submissions


class CanAccessSubmission(permissions.BasePermission):
    # Custom permission class to determine if the currect user has access
    # to the submission data.
    def has_permission(self, request, view):
        user = request.user
        if view.action in ['list']:
            return False
        elif view.action in ['download_selection']:
            return user.is_teacher or user.is_admin or user.is_superuser
        elif view.action in ['create']:
            if user.is_student:
                group_id = request.data.get('group_id')
                if not Group.objects.filter(group_id=group_id).exists():
                    if user.is_admin or user.is_superuser:
                        return Response(status=status.HTTP_404_NOT_FOUND)
                    return False
                group = Group.objects.get(group_id=group_id)
                if group.user.filter(id=user.id).exists():
                    return True
                else:
                    raise NotInGroupError()
            elif user.is_admin or user.is_superuser:
                return True
            else:
                return False
        else:
            if ('pk' not in view.kwargs.keys()) and (user.is_teacher or user.is_admin or user.is_superuser):
                return True
            submission = Submissions.objects.get(submission_id=view.kwargs['pk'])
            group_id = submission.group_id.group_id
            if not Group.objects.filter(group_id=group_id).exists():
                if user.is_admin or user.is_superuser:
                    return Response(status=status.HTTP_404_NOT_FOUND)
                elif user.is_teacher:
                    return True
                return False
            group = Group.objects.get(group_id=group_id)
            if user.is_admin or user.is_superuser:
                return True
            elif user.is_teacher:
                group = Group.objects.get(group_id=group_id)
                project = Project.objects.get(project_id=group.project_id.project_id)
                course = Course.objects.get(course_id=project.course_id.course_id)
                if user.course.filter(course_id=course.course_id).exists():
                    return True
            elif user.is_student:
                if group.user.filter(id=user.id).exists():
                    return view.action in ['retrieve', 'create', 'download', 'get_project']
            return False

class NotInGroupError(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "you are not in a group for this project, please join one."
    default_code = 'ERROR_NOT_IN_GROUP'