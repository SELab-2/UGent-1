# Generated by Django 5.0.2 on 2024-03-07 20:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='group_nr',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
