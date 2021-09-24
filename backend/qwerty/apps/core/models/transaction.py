import uuid

from django.db import models

from qwerty.apps.accounts.models import StudentUser


class Item(models.Model):
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    transaction = models.ForeignKey("Transaction", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()


class Transaction(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    products = models.ManyToManyField(
        "Product", related_name="transactions", through="Item"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    student = models.ForeignKey(StudentUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.id
