# Generated by Django 4.2.11 on 2024-04-01 13:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='conditions',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='file_structure',
            field=models.TextField(blank=True, null=True),
        ),
    ]
