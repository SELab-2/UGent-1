from rest_framework import permissions, status
from rest_framework.response import Response

from backend.pigeonhole.apps.groups.models import Group


class CanAccessSubmission(permissions.BasePermission):
    # Custom permission class to determine if the currect user has access
    # to the submission data.
    def has_permission(self, request, view):
        user = request.user
        if view.action in ['list']:
            return False
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
                    return False
            elif user.is_admin or user.is_superuser:
                return True
            else:
                return False
        else:
            group_id = int(view.kwargs.get('pk'))
            if not Group.objects.filter(group_id=group_id).exists():
                if user.is_admin or user.is_superuser:
                    return Response(status=status.HTTP_404_NOT_FOUND)
                return False
            group = Group.objects.get(group_id=group_id)
            if user.is_admin or user.is_superuser:
                return True
            elif user.is_teacher:
                if group.user.filter(id=user.id).exists():
                    return view.action in ['retrieve']
            elif user.is_student:
                if group.user.filter(id=user.id).exists():
                    return view.action in ['retrieve', 'create']
            return False
