from django import template
from django.conf import settings

register = template.Library()


@register.simple_tag
def get_reset_pin_endpoint():
    """ Retrieve endpoint for resetting the pin """
    return settings.RESET_PIN_ENDPOINT
