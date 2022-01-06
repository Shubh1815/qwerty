from .base import *

INSTALLED_APPS += [
    "debug_toolbar",
    "django_extensions",
]

MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")

INTERNAL_IPS = ["127.0.0.1"]

# ==============================================================================
# EMAIL CONFIGURATIONS
# ==============================================================================

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
