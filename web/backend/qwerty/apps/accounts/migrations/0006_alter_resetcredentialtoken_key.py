# Generated by Django 3.2.7 on 2021-11-11 08:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_alter_student_pin'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resetcredentialtoken',
            name='key',
            field=models.CharField(db_index=True, max_length=127, unique=True),
        ),
    ]
