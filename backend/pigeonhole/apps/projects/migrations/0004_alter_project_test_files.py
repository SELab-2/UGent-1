# Generated by Django 4.2.11 on 2024-04-07 11:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0003_project_test_files'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='test_files',
            field=models.FileField(blank=True, null=True, upload_to=
            'projects/<django.db.models.fields.BigAutoField>/tests/'),
        ),
    ]
