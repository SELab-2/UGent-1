# Generated by Django 4.2.11 on 2024-04-01 12:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.IntegerField(choices=[(1, 'Admin'), (2, 'Teacher'), (3, 'Student')], default=3),
        ),
    ]
