# Generated by Django 3.2.7 on 2021-10-08 10:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20211005_1117'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='transaction',
            options={'ordering': ('-date',)},
        ),
    ]
