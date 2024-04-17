from django_filters import FilterSet, CharFilter
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from backend.pigeonhole.apps.projects.models import Project
from backend.pigeonhole.apps.users.models import User
from backend.pigeonhole.apps.courses.models import Course
from backend.pigeonhole.apps.submissions.models import Submissions
from backend.pigeonhole.apps.groups.models import Group
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination


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


class UserFilter(FilterSet):
    # Define filters for fields you want to filter on
    keyword = CharFilter(method="filter_keyword")

    class Meta:
        model = User
        fields = []

    def filter_keyword(self, queryset, name, value):
        return queryset.filter(Q(username__icontains=value) | Q(email__icontains=value))


class ProjectFilter(FilterSet):
    # Define filters for fields you want to filter on
    keyword = CharFilter(method="filter_keyword")

    class Meta:
        model = Project
        fields = []

    def filter_keyword(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) | Q(description__icontains=value)
        )


class SubmissionFilter(FilterSet):
    # Define filters for fields you want to filter on
    keyword = CharFilter(method="filter_keyword")

    class Meta:
        model = Submissions
        fields = []

    def filter_keyword(self, queryset, name, value):
        return queryset.filter(
            Q(submission_nr__icontains=value) | Q(timestamp__icontains=value)
        )


class GroupFilter(FilterSet):
    # Define filters for fields you want to filter on
    keyword = CharFilter(method="filter_keyword")

    class Meta:
        model = Group
        fields = []

    def filter_keyword(self, queryset, name, value):
        return queryset.filter(
            Q(group_nr__icontains=value)
        )
