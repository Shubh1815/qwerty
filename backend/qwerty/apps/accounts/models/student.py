import uuid

from django.conf import settings
from django.db import models


class Student(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student"
    )

    enrollment_no = models.CharField(max_length=255)
    batch = models.CharField(max_length=15)
    balance = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ("batch", "enrollment_no")

    def __str__(self):
        return self.enrollment_no
