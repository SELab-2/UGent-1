# Generated by Django 4.2.13 on 2024-05-19 11:35

import backend.pigeonhole.apps.projects.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='test_dockerfile',
            field=models.FileField(blank=True, null=True, upload_to=backend.pigeonhole.apps.projects.models.get_upload_to),
        ),
    ]
