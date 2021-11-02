from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "qwerty.apps.accounts"

    def ready(self):
        import qwerty.apps.accounts.signals
