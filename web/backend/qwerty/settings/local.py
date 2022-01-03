from .base import *

INSTALLED_APPS += [
    "debug_toolbar",
    "django_extensions",
]

MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")

# ==============================================================================
# EMAIL CONFIGURATIONS
# ==============================================================================

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
