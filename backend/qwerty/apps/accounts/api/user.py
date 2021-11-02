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


class UserRetrieveView(APIView):

    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request):
        try:
            serializer = UserSerializer(
                instance=request.user, context={"request": request}
            )
            response = BaseResponse.success(serializer.data)
        except Exception as e:
            print(e)
            response = BaseResponse.exception_handler(e, request)
        finally:
            return response
