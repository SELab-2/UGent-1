from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from microsoft_auth.views import AuthenticateCallbackView
from rest_framework import routers, permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from backend.pigeonhole.apps.courses.views import CourseViewSet
from backend.pigeonhole.apps.groups.views import GroupViewSet
from backend.pigeonhole.apps.projects.views import ProjectViewSet
from backend.pigeonhole.apps.submissions.views import SubmissionsViewset
from backend.pigeonhole.apps.users.views import UserViewSet

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
router.register(r'courses', CourseViewSet)
router.register(r'submissions', SubmissionsViewset)
router.register(r'courses/(?P<course_id>[^/.]+)/projects', ProjectViewSet)
router.register(r'courses/(?P<course_id>[^/.]+)/projects/(?P<project_id>[^/.]+)/groups', GroupViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
                  path('', include(router.urls)),
                  path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
                  path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
                  path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
                  path("admin/", admin.site.urls),
                  path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
                  path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
                  path('auth/callback/', AuthenticateCallbackView.as_view(), name='microsoft_auth_callback'),
                  path('microsoft/', include('microsoft_auth.urls', namespace='microsoft')),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += router.urls
