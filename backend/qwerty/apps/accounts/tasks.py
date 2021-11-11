from celery import shared_task

from django.core.mail import EmailMessage
from django.template.loader import get_template


@shared_task
def notify_student_about_account_creation(email, password):

    message = get_template("accounts/student_account_creation.html").render(
        {"email": email, "password": password}
    )

    mail = EmailMessage(
        subject="Qwerty Account Creation - Set Up Your Pin",
        from_email="shubhparmar214124@gmail.com",
        to=[email],
        body=message,
    )
    mail.content_subtype = "html"

    return mail.send()
