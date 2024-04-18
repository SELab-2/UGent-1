from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from .models import Project


class CanAccessProject(permissions.BasePermission):
    # Custom permission class to determine if the currect user has access
    # to the project data.
    def has_permission(self, request, view):
        user = request.user
        if view.action in ['create']:
            course_id = request.data.get('course_id')
            if user.is_admin or user.is_superuser:
                return True
            elif user.is_teacher:
                if user.course.filter(course_id=course_id).exists():
                    return True
            return False
        elif view.action in ['list']:
            if user.is_admin or user.is_superuser:
                return True
            return False
        elif view.action in ['get_group_submissions']:
            return True
        elif view.action in ['download_submissions', 'download_testfiles']:
            return user.is_teacher or user.is_admin or user.is_superuser
        else:
            project_id = int(view.kwargs.get('pk'))
            if not Project.objects.filter(project_id=project_id).exists():
                if user.is_admin or user.is_superuser:
                    return Response(status=status.HTTP_404_NOT_FOUND)
                return False
            course_id = Project.objects.get(project_id=project_id).course_id.course_id
            if user.is_admin or user.is_superuser:
                return True
            elif user.is_teacher:
                if user.course.filter(course_id=course_id).exists():
                    return True
            elif user.is_student:
                if not Project.objects.get(project_id=project_id).visible:
                    return False
                if user.course.filter(course_id=course_id).exists():
                    return view.action in ['retrieve', 'get_my_groups', 'get_groups']
            return False
