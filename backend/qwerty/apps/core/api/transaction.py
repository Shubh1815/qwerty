from django.db import transaction as db_transaction

from django_filters.rest_framework import DjangoFilterBackend, FilterSet, filters
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser


from qwerty.apps.accounts.permissions import (
    IsManager,
    IsStudent,
)
from qwerty.apps.base.api import BaseResponse, BaseViewSet
from qwerty.apps.core.models import Item, Transaction


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ("product", "quantity", "price_per_quantity")
        read_only_fields = ("price_per_quantity",)


class TransactionSerializer(serializers.ModelSerializer):

    items = ItemSerializer(many=True)

    class Meta:
        model = Transaction
        fields = (
            "id",
            "student",
            "items",
            "total_amount",
            "date",
        )
        read_only_fields = ("total_amount",)
        extra_kwargs = {
            "student": {
                "error_messages": {
                    "null": "For identification, scan the ID.",
                }
            }
        }

    def validate(self, attrs):
        student = attrs.get("student")

        total_amount = 0
        for item in attrs.get("items"):
            product = item.get("product")
            quantity = item.get("quantity")
            price_per_quantity = product.amount

            item["price_per_quantity"] = price_per_quantity
            total_amount += price_per_quantity * quantity

        attrs["total_amount"] = total_amount

        if student.student.balance < total_amount:
            raise ValidationError("Student doesn't have enough balance")

        return attrs

    def create(self, validated_data):

        student = validated_data.pop("student")
        items = validated_data.pop("items")
        total_amount = validated_data.pop("total_amount")

        item_instances = []

        with db_transaction.atomic():
            transaction = Transaction.objects.create(
                student=student, total_amount=total_amount
            )

            for item in items:
                product = item.get("product")
                quantity = item.get("quantity")
                price_per_quantity = item.get("quantity")

                item_instances.append(
                    Item(
                        product=product,
                        transaction=transaction,
                        price_per_quantity=price_per_quantity,
                        quantity=quantity,
                    )
                )

            Item.objects.bulk_create(item_instances)

            return transaction


class TransactionFilter(FilterSet):
    date = filters.DateTimeFilter(field_name="date", lookup_expr="date")

    class Meta:
        model = Transaction
        fields = ("date",)


class TransactionViewSet(BaseViewSet):

    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    http_method_names = ["get", "post"]

    filter_backends = [DjangoFilterBackend]
    filterset_class = TransactionFilter

    permission_classes_by_action = {
        "list": ((IsAdminUser | IsStudent),),
        "retrieve": ((IsAdminUser | IsStudent),),
        "create": ((IsAdminUser | IsManager),),
    }

    def get_permissions(self):
        return [
            permission()
            for permission in self.permission_classes_by_action[self.action]
        ]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_superuser:
            return queryset
        return queryset.filter(student=self.request.user)

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)

            serializer = self.get_serializer(page, many=True)
            transactions = self.get_paginated_response(serializer.data)

            response = BaseResponse.paginated(transactions)
        except Exception as e:
            response = BaseResponse.exception_handler(e, request)
        finally:
            return response

    def retrieve(self, request, *args, **kwargs):
        try:
            transaction = self.get_object()
            serializer = self.get_serializer(transaction)

            response = BaseResponse.success(serializer.data)
        except Exception as e:
            response = BaseResponse.exception_handler(e, request)
        finally:
            return response

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            response = BaseResponse.created(serializer.data)
        except Exception as e:
            response = BaseResponse.exception_handler(e, request)
        finally:
            return response
