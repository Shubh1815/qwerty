from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .models import Item, Transaction


@receiver(pre_save, sender=Item)
def copy_amount(sender, instance, **kwargs):
    if not instance.price_per_quantity:
        instance.price_per_quantity = instance.product.amount


@receiver(post_save, sender=Transaction)
def update_student_balance(sender, instance, **kwargs):
    student_data = instance.student.student
    student_data.balance -= instance.total_amount
    student_data.save()
