# Generated by Django 5.0.3 on 2024-03-12 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0005_remove_group_student_group_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='max_score',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]