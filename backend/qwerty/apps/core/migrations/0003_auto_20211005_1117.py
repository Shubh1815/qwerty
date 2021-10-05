# Generated by Django 3.2.7 on 2021-10-05 11:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20211002_0706'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='price_per_quantity',
            field=models.DecimalField(blank=True, decimal_places=2, editable=False, max_digits=10),
        ),
        migrations.AlterField(
            model_name='item',
            name='transaction',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='core.transaction'),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='total_amount',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10),
        ),
    ]