from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path as urlpath
from django.shortcuts import redirect
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from microsoft_auth.views import AuthenticateCallbackView, AuthenticateCallbackRedirect, to_ms_redirect
from rest_framework import routers, permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.urls import urlpatterns as drf_urlpatterns

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

def to_frontend(request, path):
    return redirect(f"{settings.FRONTEND_URL}/{path}")

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
                  urlpath('', include(router.urls)),
                  urlpath('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
                  urlpath('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
                  urlpath('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
                  urlpath("admin/", admin.site.urls),
                  urlpath('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
                  urlpath('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
                  urlpath('microsoft/', include('microsoft_auth.urls', namespace='microsoft')),
                  urlpath('redirect/<path:path>', to_frontend, name='redirect'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



urlpatterns += router.urls
