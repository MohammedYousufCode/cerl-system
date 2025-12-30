from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ResourceViewSet, 
    ResourceUpdateViewSet,
    UserViewSet,
    register_user,
    login_user,
    get_current_user
)

router = DefaultRouter()
router.register('resources', ResourceViewSet)
router.register('resource-updates', ResourceUpdateViewSet)
router.register('users', UserViewSet)

urlpatterns = [
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('auth/me/', get_current_user, name='current-user'),
    path('', include(router.urls)),
]
