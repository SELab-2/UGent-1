# Generated by Django 4.2.11 on 2024-04-07 11:30

from django.db import migrations, models

import backend.pigeonhole.apps.projects.models


class Migration(migrations.Migration):
    dependencies = [
        ('projects', '0004_alter_project_test_files'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='test_files',
            field=models.FileField(blank=True, null=True,
                                   upload_to=backend.pigeonhole.apps.projects.models.get_upload_to),
        ),
    ]
