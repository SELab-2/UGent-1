# Generated by Django 4.2.13 on 2024-05-22 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('submissions', '0004_remove_submissions_file_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='submissions',
            name='feedback_simple_test',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='submissions',
            name='output_simple_test',
            field=models.BooleanField(blank=True, default=False),
        ),
    ]
