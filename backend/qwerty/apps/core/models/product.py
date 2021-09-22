from django.db import models


class Product(models.Model):
    class Categories(models.TextChoices):
        CANTEEN = "canteen", "Canteen"
        STATIONARY = "stationary", "Stationary"
        TRANSPORTATION = "transportation", "Transportation"

    name = models.CharField(max_length=63, primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=15, choices=Categories.choices)

    class Meta:
        ordering = ("category", "name")

    def __str__(self):
        return self.name

    def get_amount(self):
        return f"Rs. {self.amount}"
