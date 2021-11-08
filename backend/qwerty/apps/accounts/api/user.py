from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from rest_framework_simplejwt.token_blacklist.models import (
    OutstandingToken,
    BlacklistedToken,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from qwerty.apps.accounts.models import User, Student
from qwerty.apps.base.api import BaseResponse


class StudentInfoSerializer(serializers.ModelSerializer):

    qrcode_url = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ("enrollment_no", "batch", "balance", "qrcode_url")

    def get_qrcode_url(self, obj):
        return self.context["request"].build_absolute_uri(obj.get_qrcode_url())


class UserSerializer(serializers.ModelSerializer):

    student_info = StudentInfoSerializer(source="student", read_only=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        related_fields = ["student_info"]

        for field in related_fields:
            if data[field] is None:
                data.pop(field)

        return data

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "student_info",
            "role",
        )


class ChangePasswordSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("password", "password2", "old_password")

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password2"):
            raise ValidationError("Password fields does not match")

        return attrs

    def validate_old_password(self, value):
        request = self.context.get("request")
        user = request.user if request else None

        if not user.check_password(value):
            raise ValidationError("Old password is not correct")

        return value

    def update(self, instance, validated_data):
        instance.set_password(validated_data.get("password"))
        instance.save()

        return instance


class UserRetrieveView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = UserSerializer(
                instance=request.user, context={"request": request}
            )
            response = BaseResponse.success(serializer.data)
        except Exception as e:
            response = BaseResponse.exception_handler(e, request)
        finally:
            return response


class UserPasswordChangeView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request):

        try:
            serializer = ChangePasswordSerializer(
                instance=request.user, context={"request": request}, data=request.data
            )
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            for token in OutstandingToken.objects.filter(user=user):
                BlacklistedToken.objects.get_or_create(token=token)

            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            response = BaseResponse.success(
                {"access": str(access), "refresh": str(refresh)}
            )
        except Exception as e:
            response = BaseResponse.exception_handler(e, request)
        finally:
            return response
