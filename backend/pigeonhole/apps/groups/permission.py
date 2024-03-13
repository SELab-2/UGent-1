from requests import Response
from rest_framework import permissions, status

from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project


class CanAccessGroup(permissions.BasePermission):
    # Custom user class to check if the user can join a group.
    def has_permission(self, request, view):
        if view.action in ['create', 'list']:
            return False
        user = request.user
        group_id = int(view.kwargs.get('pk'))
        if not Group.objects.filter(group_id=group_id).exists():
            if user.is_admin or user.is_superuser:
                return Response(status=status.HTTP_404_NOT_FOUND)
            return False

        project_id = Group.objects.get(group_id=group_id).project_id
        if not Project.objects.filter(project_id=project_id).exists():
            if user.is_admin or user.is_superuser:
                return Response(status=status.HTTP_404_NOT_FOUND)
            return False

        course_id = Project.objects.get(project_id=project_id).course_id.course_id
        if user.is_admin or user.is_superuser:
            return True
        elif user.is_teacher:
            if user.course.filter(course_id=course_id).exists():
                return view.action in ['retrieve', 'get_submissions', 'update', 'partial_update']
        elif user.is_student:
            if user.course.filter(course_id=course_id).exists():
                return view.action in ['retrieve', 'join', 'leave']
        return False
