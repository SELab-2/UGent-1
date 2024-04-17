from rest_framework import permissions, status
from rest_framework.response import Response

from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.submissions.models import Submissions


class CanAccessSubmission(permissions.BasePermission):
    # Custom permission class to determine if the currect user has access
    # to the submission data.
    def has_permission(self, request, view):
        user = request.user
        if 'group_id' not in request.data:
            group = Group.objects.filter(project_id=request.data['project_id'], user=request.user).first()
            group_id = group.group_id
        else:
            group_id = request.data['group_id']
            group = Group.objects.get(group_id=group_id)
        print("checking access for " + str(user))
        if view.action in ['list']:
            return False
        elif view.action in ['download_selection', 'download_all']:
            return user.is_teacher or user.is_admin or user.is_superuser
        elif view.action in ['create']:
            if user.is_student:
                if not Group.objects.filter(group_id=group_id).exists():
                    if user.is_admin or user.is_superuser:
                        return Response(status=status.HTTP_404_NOT_FOUND)
                    return False
                if group.user.filter(id=user.id).exists():
                    return True
                else:
                    return False
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
                    return view.action in ['retrieve', 'create']
            return False
