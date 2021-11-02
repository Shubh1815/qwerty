import uuid

from django.db import models
from django.db.models.query import Prefetch, F

from qwerty.apps.accounts.models import StudentUser


class Item(models.Model):
    transaction = models.ForeignKey(
        "Transaction", related_name="items", on_delete=models.CASCADE
    )
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    price_per_quantity = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, editable=False
    )
    quantity = models.PositiveIntegerField()


class TransactionManager(models.Manager):
    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .prefetch_related(
                Prefetch(
                    "items",
                    # queryset=Item.objects.annotate(category=F("product__category")),
                )
            )
        )


class Transaction(models.Model):
    class Categories(models.TextChoices):
        CANTEEN = "canteen", "Canteen"
        STATIONARY = "stationary", "Stationary"
        TRANSPORTATION = "transportation", "Transportation"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(StudentUser, on_delete=models.CASCADE)
    products = models.ManyToManyField(
        "Product", related_name="transactions", through="Item"
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    objects = TransactionManager()

    class Meta:
        ordering = ("-date",)

    def __str__(self):
        return str(self.id)
