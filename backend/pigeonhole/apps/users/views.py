from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from backend.pigeonhole.apps.users.models import User, UserSerializer
from .permissions import UserPermissions
from backend.pigeonhole.filters import CustomPageNumberPagination, UserFilter


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, UserPermissions]
    pagination_class = CustomPageNumberPagination
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    ordering_fields = ["email"]
    filterset_class = UserFilter

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
        filter_backend = DjangoFilterBackend()
        queryset = filter_backend.filter_queryset(self.request, queryset, self)
        queryset = self.order_queryset(queryset)
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = self.get_serializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=["post"])
    def add_course_to_user(self, request, pk=None):
        user = self.get_object()
        course_id = request.data.get("course_id")
        user.course.add(course_id)
        user.save()
        return Response(
            {"status": "Course added successfully"}, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["post"])
    def remove_course_from_user(self, request, pk=None):
        user = self.get_object()
        course_id = request.data.get("course_id")
        user.course.remove(course_id)
        user.save()
        return Response(
            {"status": "Course removed successfully"}, status=status.HTTP_200_OK
        )

    def get_object(self):
        pk = self.kwargs.get("pk")

        if pk == "current":
            return self.request.user

        return super().get_object()
