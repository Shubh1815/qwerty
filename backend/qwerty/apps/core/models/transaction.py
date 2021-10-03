import uuid

from django.db import models

from qwerty.apps.accounts.models import StudentUser


class Item(models.Model):
    transaction = models.ForeignKey("Transaction", on_delete=models.CASCADE)
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    price_per_quantity = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, editable=False
    )
    quantity = models.PositiveIntegerField()


class Transaction(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(StudentUser, on_delete=models.CASCADE)
    products = models.ManyToManyField(
        "Product", related_name="transactions", through="Item"
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)
