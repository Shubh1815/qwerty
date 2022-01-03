from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.permissions import IsAdminUser

from qwerty.apps.accounts.permissions import IsManager
from qwerty.apps.base.api import BaseResponse, BaseViewSet
from qwerty.apps.core.models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("name", "amount", "category")


class ProductViewSet(BaseViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [(IsAdminUser | IsManager)]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ("category",)
    http_methods_name = ["get"]

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            response = BaseResponse.success(serializer.data)
        except Exception as e:
            response = BaseResponse.exception_handler(e, request)
        finally:
            return response

    def retrieve(self, request, *args, **kwargs):
        try:
            product = self.get_object()
            serializer = self.get_serializer(product)
            response = BaseResponse.success(serializer.data)
        except Exception as e:
            print(type(e))
            response = BaseResponse.exception_handler(e, request)
        finally:
            return response
