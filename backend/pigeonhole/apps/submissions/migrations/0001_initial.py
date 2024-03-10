# Generated by Django 5.0.3 on 2024-03-10 16:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('groups', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Submissions',
            fields=[
                ('submission_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('submission_nr', models.IntegerField()),
                ('file', models.FileField(null=True, upload_to='uploads/<django.db.models.fields.related.ForeignKey>/<django.db.models.fields.IntegerField>/')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('output_test', models.FileField(null=True, upload_to='uploads/<django.db.models.fields.related.ForeignKey>/<django.db.models.fields.IntegerField>/output_test/')),
                ('group_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='groups.group')),
            ],
        ),
    ]
