from django.core.exceptions import ValidationError
from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Item


@receiver(pre_save, sender=Item)
def copy_amount_and_update_student_balance(sender, instance, **kwargs):
    instance.price_per_quantity = instance.product.amount

    price = instance.price_per_quantity * instance.quantity
    transaction = instance.transaction
    student_data = transaction.student.student

    if student_data.balance < price:
        raise ValidationError("Student doesn't have enough balance")

    transaction.total_amount += price
    transaction.save()

    student_data.balance -= price
    student_data.save()
