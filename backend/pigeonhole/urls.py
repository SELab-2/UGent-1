from django.urls import include, path
from django.contrib import admin
from rest_framework import routers, permissions

from backend.testapi import views as test_views
from backend.pigeonhole.apps.courses.views import CourseViewSet
from backend.pigeonhole.apps.projects.views import ProjectViewSet
from backend.pigeonhole.apps.submissions.views import SubmissionsViewset
from backend.pigeonhole.apps.groups.views import GroupViewSet
from backend.pigeonhole.apps.users.views import StudentViewSet, UserViewSet
#from backend.pigeonhole.apps.projects import views as project_views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="My API",
        default_version='v1',
        description="My API description",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="Awesome License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'students', StudentViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'courses/<int:course_id>/projects/<project_id>', ProjectViewSet)
router.register(r'submissions', SubmissionsViewset)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path("admin/", admin.site.urls),
    path('courses/<int:course_id>/projects/', ProjectViewSet.as_view({'post': 'create'}), name='project-create'),
]

urlpatterns += router.urls
