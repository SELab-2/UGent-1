from django.urls import include, path
from django.contrib import admin
from rest_framework import routers, permissions

from backend.testapi import views as test_views
from backend.pigeonhole.apps.courses.views import CourseViewSet
from backend.pigeonhole.apps.projects.views import ProjectViewSet
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
router.register(r'users', test_views.UserViewSet)
router.register(r'groups', test_views.GroupViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'courses/<int:subject_id>/project/<int:project_id>', ProjectViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path("admin/", admin.site.urls),
]

urlpatterns += router.urls
