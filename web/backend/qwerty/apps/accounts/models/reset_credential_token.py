from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone

from qwerty.apps.accounts.tokens import ResetTokenGenerator

TokenGenerator = ResetTokenGenerator()
User = get_user_model()


class ResetCredentialToken(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    key = models.CharField(max_length=127, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Reset Credential Token"
        verbose_name_plural = "Reset Credentail Tokens"

    def __str__(self):
        return f"Reset Token for {self.user}"

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = TokenGenerator.make_token()
        return super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return (timezone.now() - settings.RESET_TOKEN_LIFETIME) >= self.created_at
