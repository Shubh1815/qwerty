import io
import os
import qrcode

from django.conf import settings
from django.core.files import File
from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Student


@receiver(pre_save, sender=Student)
def create_qrcode_for_id(sender, instance, **kwargs):
    id = instance.user.id
    path = os.path.join(
        settings.MEDIA_ROOT,
        Student.qrcode.field.upload_to,
        instance.batch,
        f"{instance.enrollment_no}.png",
    )

    if not os.path.exists(path):
        qr = qrcode.QRCode(
            version=1,
            box_size=10,
            border=5,
        )
        qr.add_data(id)
        qr.make(fit=True)

        buffer = io.BytesIO()

        img = qr.make_image(fill="black", back_color="white")
        img.save(buffer, format="PNG")

        buffer.seek(io.SEEK_SET)

        instance.qrcode = File(
            buffer, name=f"{instance.batch}/{instance.enrollment_no}.png"
        )
