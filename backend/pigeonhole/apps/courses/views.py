from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from backend.pigeonhole.apps.courses.models import CourseSerializer
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.projects.models import ProjectSerializer
from backend.pigeonhole.apps.users.models import User, UserSerializer
from .models import Course
from .permissions import CourseUserPermissions
from backend.pigeonhole.filters import (
    CourseFilter,
    UserFilter,
    ProjectFilter,
    CustomPageNumberPagination,
)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, CourseUserPermissions]
    pagination_class = CustomPageNumberPagination
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    ordering_fields = ["name"]

    def order_queryset(self, queryset):
        order_by = self.request.query_params.get("order_by")
        sort_order = self.request.query_params.get("sort_order")

        if order_by and sort_order:
            if sort_order.lower() == "desc":
                order_by = f"-{order_by}"
            return queryset.order_by(order_by)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        queryset = CourseFilter(request.GET, queryset=queryset).qs
        queryset = self.order_queryset(queryset)
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    def perform_create(self, serializer):
        course = serializer.save()
        user = self.request.user
        user.course.add(course)

    @action(detail=True, methods=["post"])
    def join_course(self, request, *args, **kwargs):
        course = self.get_object()
        user = request.user

        if request.user.is_student:
            if course.open_course:
                user.course.add(course)
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(
                    {"message": "Invite token required."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        else:
            user.course.add(course)
            return Response(status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=["post"],
        url_path="join_course_with_token/(?P<invite_token>[^/.]+)",
    )
    def join_course_with_token(self, request, *args, **kwargs):
        course = self.get_object()
        user = request.user
        invite_token = kwargs.get("invite_token")

        if invite_token == course.invite_token:
            user.course.add(course)
            return Response(
                {"message": "Successfully joined the course with invite token."},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Invalid invite token."}, status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=["post"])
    def leave_course(self, request, *args, **kwargs):
        course = self.get_object()
        user = request.user
        if course in user.course.all():
            projects = Project.objects.filter(course_id=course.course_id)
            for project in projects:
                groups = Group.objects.filter(project_id=project.project_id)
                for group in groups:
                    if user in group.user.all():
                        group.user.remove(user)
                        group.save()
            user.course.remove(course)
        else:
            return Response(
                {"message": "User is not in course"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=["GET"])
    def get_selected_courses(self, request, *args, **kwargs):
        user = request.user
        courses = Course.objects.filter(user=user)
        course_filter = CourseFilter(request.GET, queryset=courses)
        paginated_queryset = self.paginate_queryset(course_filter.qs)
        queryset = self.order_queryset(paginated_queryset)
        serializer = CourseSerializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=["GET"])
    def get_users(self, request, *args, **kwargs):
        course = self.get_object()
        users = User.objects.filter(course=course)
        user_filter = UserFilter(request.GET, queryset=users)
        queryset = user_filter.qs  # Keep queryset until ordering
        queryset = self.order_queryset(queryset)
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = UserSerializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=["GET"])
    def get_students(self, request, *args, **kwargs):
        course = self.get_object()
        users = User.objects.filter(course=course, role=3)
        user_filter = UserFilter(request.GET, queryset=users)
        queryset = user_filter.qs  # Keep queryset until ordering
        queryset = self.order_queryset(queryset)
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = UserSerializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=["GET"])
    def get_teachers(self, request, *args, **kwargs):
        course = self.get_object()
        users = User.objects.filter(course=course).exclude(role=3)
        user_filter = UserFilter(request.GET, queryset=users)
        queryset = user_filter.qs  # Keep queryset until ordering
        queryset = self.order_queryset(queryset)
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = UserSerializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=["GET"])
    def get_projects(self, request, *args, **kwargs):
        course = self.get_object()
        projects = Project.objects.filter(course_id=course)
        project_filter = ProjectFilter(request.GET, queryset=projects)
        queryset = project_filter.qs  # Keep queryset until ordering
        queryset = self.order_queryset(queryset)
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = ProjectSerializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=False, methods=["GET"])
    def get_archived_courses(self, request, *args, **kwargs):
        user = request.user
        courses = Course.objects.filter(user=user, archived=True)
        course_filter = CourseFilter(request.GET, queryset=courses)
        paginated_queryset = self.paginate_queryset(course_filter.qs)
        queryset = self.order_queryset(paginated_queryset)
        serializer = CourseSerializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)
