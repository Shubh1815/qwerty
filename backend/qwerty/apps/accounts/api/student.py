from django.core.validators import RegexValidator
from django.db import transaction as db_transaction

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView

from qwerty.apps.accounts.models import ResetCredentialToken, Student, StudentUser
from qwerty.apps.base.api.response import BaseResponse


class ResetPinRequestSerializer(serializers.Serializer):

    email = serializers.EmailField()

    def validate(self, attrs):

        if not StudentUser.objects.filter(email=attrs.get("email")).exists():
            raise ValidationError("No student exist with that email")

        return super().validate(attrs)


class ResetPinSerializer(serializers.Serializer):

    key = serializers.CharField(max_length=127)

    pin = serializers.CharField(
        max_length=6,
        validators=[
            RegexValidator(
                regex="^[0-9]{6,6}$", message="Pin must be of 6 digits", code="invalid"
            )
        ],
    )
    pin2 = serializers.CharField(max_length=6)

    def validate(self, attrs):

        try:
            token = ResetCredentialToken.objects.get(key=attrs.get("key"))
        except ResetCredentialToken.DoesNotExist:
            raise ValidationError("Invalid Token Key")

        if token.is_expired:
            raise ValidationError("Token is already expired")

        if attrs.get("pin") != attrs.get("pin2"):
            raise ValidationError("Pin fields does not match")

        return super().validate(attrs)


class ResetPinRequestView(APIView):
    def post(sef, request):
        try:
            serializer = ResetPinRequestSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            student = StudentUser.objects.get(
                email=serializer.validated_data.get("email")
            )
            token = ResetCredentialToken.objects.create(user=student)

            response = BaseResponse.success({"key": token.key})
        except Exception as e:
            response = BaseResponse.exception_handler(e, request)
        finally:
            return response


class ResetPinView(APIView):
    def post(self, request):
        try:
            serializer = ResetPinSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            key = serializer.validated_data.get("key")
            pin = serializer.validated_data.get("pin")

            with db_transaction.atomic():
                token = ResetCredentialToken.objects.get(key=key)

                student = Student.objects.get(user=token.user)
                student.set_pin(pin)
                student.save(update_fields=["pin"])

                token.delete()

                response = BaseResponse.success("Pin changed successfully")

        except Exception as e:
            response = BaseResponse.exception_handler(e, request)

        finally:
            return response
