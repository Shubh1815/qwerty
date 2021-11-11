from django.urls import path

from .api import (
    ResetPinView,
    ResetPinRequestView,
    UserPasswordChangeView,
    UserRetrieveView,
)

urlpatterns = [
    path("user/", UserRetrieveView.as_view(), name="retrieve-user-data"),
    path(
        "user/change_password/",
        UserPasswordChangeView.as_view(),
        name="user-password-change",
    ),
    path(
        "student/reset_pin/",
        ResetPinRequestView.as_view(),
        name="reset-student-pin-request",
    ),
    path(
        "student/reset_pin/confirm/",
        ResetPinView.as_view(),
        name="reset-student-pin-confirm",
    ),
]
