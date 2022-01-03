from .base import *

# ==============================================================================
# CORE SETTINGS
# ==============================================================================

DEBUG = False

# ==============================================================================
# EMAIL CONFIGURATIONS
# ==============================================================================

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# ==============================================================================
# Celery CONFIGURATIONS
# ==============================================================================

CELERY = {
    'BROKER_URL': env.str('CELERY_BROKER'),
    'CELERY_IMPORTS': ('Worker.tasks', ),
    'CELERY_TASK_SERIALIZER': 'json',
    'CELERY_RESULT_SERIALIZER': 'json',
    'CELERY_ACCEPT_CONTENT': ['json'],
}
