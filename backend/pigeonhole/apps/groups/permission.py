from rest_framework import permissions, status
from rest_framework.response import Response

from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project


class CanAccessGroup(permissions.BasePermission):
    # Custom user class to check if the user can join a group.
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            # If user is not authenticated, deny permission
            return False

        if view.action in ['create', 'list']:
            return False

        user = request.user
        group_id = int(view.kwargs.get('pk'))
        if not Group.objects.filter(group_id=group_id).exists():
            if user.is_admin or user.is_superuser:
                return Response(status=status.HTTP_404_NOT_FOUND)
            return False

        project_id = Group.objects.get(group_id=group_id).project_id.project_id
        if not Project.objects.filter(project_id=project_id).exists():
            if user.is_admin or user.is_superuser:
                return Response(status=status.HTTP_404_NOT_FOUND)
            return False

        course_id = Project.objects.get(project_id=project_id).course_id.course_id
        if user.is_admin or user.is_superuser:
            return view.action not in ['join', 'leave']
        elif user.is_teacher:
            if user.course.filter(course_id=course_id).exists():
                return view.action in ['retrieve', 'get_submissions', 'update', 'partial_update']
        elif user.is_student:
            if user.course.filter(course_id=course_id).exists():
                # check if the user is already in the group
                if Group.objects.get(group_id=group_id).user.filter(id=user.id).exists():
                    return view.action in ['retrieve', 'get_submissions', 'leave']
                elif Group.objects.get(group_id=group_id).user.count() < Project.objects.get(
                        project_id=project_id).group_size:
                    return view.action in ['retrieve', 'get_submissions', 'join']
                elif view.action in ['join']:
                    return Response({'message': 'Group is full'}, status=status.HTTP_400_BAD_REQUEST)
                elif view.action in ['leave']:
                    return Response({'message': 'User is not in the group'}, status=status.HTTP_400_BAD_REQUEST)
        return False
