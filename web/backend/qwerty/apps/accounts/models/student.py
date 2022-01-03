from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from django.core.validators import RegexValidator
from django.db import models


class Student(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student"
    )

    enrollment_no = models.CharField(max_length=255)
    batch = models.CharField(max_length=15)
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    pin = models.CharField(
        max_length=127,
        validators=[
            RegexValidator(
                regex="^[0-9]{6,6}$", message="Pin must be of 6 digits", code="invalid"
            )
        ],
        null=True,
        blank=True,
    )

    qrcode = models.ImageField(upload_to="qrcode/", null=True, blank=True)
    is_id_disabled = models.BooleanField(default=False, verbose_name="ID Disabled")

    _pin = None

    class Meta:
        ordering = ("batch", "enrollment_no")

    def __str__(self):
        return self.enrollment_no

    def get_qrcode_url(self):
        return self.qrcode.url

    def set_pin(self, raw_pin):
        self.pin = make_password(raw_pin)
        self._pin = raw_pin

    def check_pin(self, raw_pin):
        def setter(raw_pin):
            self.set_pin(raw_pin)
            self._pin = None
            self.save(update_fields=["pin"])

        return check_password(raw_pin, self.pin, setter)
