from rest_framework.routers import SimpleRouter

from backend.pigeonhole.apps.users.viewsets import LoginViewSet

routes = SimpleRouter()

# AUTHENTICATION
routes.register(r'auth/login', LoginViewSet, basename='auth-login')
