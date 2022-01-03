from django.db import models


class Calorie(models.Model):
    product = models.OneToOneField(
        "Product", related_name="calorie", on_delete=models.CASCADE
    )
    calories = models.DecimalField(max_digits=7, decimal_places=2)

    def __str__(self):
        return self.product.name
