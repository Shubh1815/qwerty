from django.apps import AppConfig


class CoreConfig(AppConfig):
    name = "qwerty.apps.core"

    def ready(self):
        import qwerty.apps.core.signals
