from django.contrib.auth import get_user_model

from rest_framework.permissions import IsAuthenticated, SAFE_METHODS

User = get_user_model()


class IsStudent(IsAuthenticated):
    def has_permission(self, request, view):
        is_authenticated = super().has_permission(request, view)
        return is_authenticated and request.user.role == User.Roles.STUDENT


class IsManager(IsAuthenticated):
    def has_permission(self, request, view):
        is_authenticated = super().has_permission(request, view)
        return is_authenticated and request.user.role == User.Roles.MANAGER
