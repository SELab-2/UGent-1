# Generated by Django 5.0.3 on 2024-03-10 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0003_alter_project_deadline'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='deadline',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]