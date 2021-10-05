from django.db import transaction as db_transaction

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListCreateAPIView

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
            "date",
            "items",
            "total_amount",
        )
        read_only_fields = ("total_amount",)

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
