from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters import FilterSet, CharFilter
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from backend.pigeonhole.apps.courses.models import CourseSerializer
from backend.pigeonhole.apps.groups.models import Group
from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.projects.models import ProjectSerializer
from backend.pigeonhole.apps.users.models import User
from backend.pigeonhole.apps.users.models import UserSerializer
from .models import Course
from .permissions import CourseUserPermissions
from django.db.models import Q


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10  # Set the default page size here
    page_size_query_param = "page_size"
    max_page_size = 100


class CourseFilter(FilterSet):
    # Define filters for fields you want to filter on
    keyword = CharFilter(method="filter_keyword")

    class Meta:
        model = Course
        fields = []

    def filter_keyword(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) | Q(description__icontains=value)
        )


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, CourseUserPermissions]
    pagination_class = CustomPageNumberPagination
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    ordering_fields = ["name"]
    filterset_class = CourseFilter

    def get_queryset(self):
        queryset = super().get_queryset()
        order_by = self.request.query_params.get("order_by")
        sort_order = self.request.query_params.get("sort_order")

        if order_by and sort_order:
            if sort_order.lower() == "desc":
                order_by = f"-{order_by}"
            queryset = queryset.order_by(order_by)

        return queryset

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
        courses = user.course.all()

        page_size = request.query_params.get(
            "page_size", self.pagination_class.page_size
        )

        paginator = CustomPageNumberPagination()
        paginator.page_size = page_size
        paginator.page_query_param = "page"
        paginator.page_size_query_param = "page_size"
        paginator.max_page_size = 100

        paginated_courses = paginator.paginate_queryset(courses, request)
        serializer = CourseSerializer(paginated_courses, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(detail=True, methods=["GET"])
    def get_users(self, request, *args, **kwargs):
        course = self.get_object()
        users = User.objects.filter(course=course)
        res = [user for user in users if course in user.course.all()]

        page_size = request.query_params.get(
            "page_size", self.pagination_class.page_size
        )

        paginator = CustomPageNumberPagination()
        paginator.page_size = page_size
        paginator.page_query_param = "page"
        paginator.page_size_query_param = "page_size"
        paginator.max_page_size = 100

        paginated_users = paginator.paginate_queryset(res, request)
        serializer = UserSerializer(paginated_users, many=True)

        return paginator.get_paginated_response(serializer.data)

    @action(detail=True, methods=["GET"])
    def get_students(self, request, *args, **kwargs):
        course = self.get_object()
        res = [
            user
            for user in User.objects.all()
            if course in user.course.all() and (user.role == 3)
        ]
        page_size = request.query_params.get(
            "page_size", self.pagination_class.page_size
        )

        paginator = CustomPageNumberPagination()
        paginator.page_size = page_size
        paginator.page_query_param = "page"
        paginator.page_size_query_param = "page_size"
        paginator.max_page_size = 100

        paginated_users = paginator.paginate_queryset(res, request)
        serializer = UserSerializer(paginated_users, many=True)

        return paginator.get_paginated_response(serializer.data)

    @action(detail=True, methods=["GET"])
    def get_teachers(self, request, *args, **kwargs):
        course = self.get_object()
        res = [
            user
            for user in User.objects.all()
            if course in user.course.all() and (user.role != 3)
        ]

        page_size = request.query_params.get(
            "page_size", self.pagination_class.page_size
        )

        paginator = CustomPageNumberPagination()
        paginator.page_size = page_size
        paginator.page_query_param = "page"
        paginator.page_size_query_param = "page_size"
        paginator.max_page_size = 100

        paginated_users = paginator.paginate_queryset(res, request)
        serializer = UserSerializer(paginated_users, many=True)

        return paginator.get_paginated_response(serializer.data)

    @action(detail=True, methods=["GET"])
    def get_projects(self, request, *args, **kwargs):
        course = self.get_object()
        projects = Project.objects.filter(course_id=course)

        page_size = request.query_params.get(
            "page_size", self.pagination_class.page_size
        )

        paginator = CustomPageNumberPagination()
        paginator.page_size = page_size
        paginator.page_query_param = "page"
        paginator.page_size_query_param = "page_size"
        paginator.max_page_size = 100

        paginated_projects = paginator.paginate_queryset(projects, request)
        serializer = ProjectSerializer(paginated_projects, many=True)
        return paginator.get_paginated_response(serializer.data)
