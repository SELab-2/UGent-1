# Generated by Django 4.2.11 on 2024-04-01 15:13

import backend.pigeonhole.apps.submissions.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("groups", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Submissions",
            fields=[
                (
                    "submission_id",
                    models.BigAutoField(primary_key=True, serialize=False),
                ),
                ("submission_nr", models.IntegerField(blank=True)),
                (
                    "file",
                    models.FileField(
                        max_length=255,
                        null=True,
                        upload_to=backend.
                        pigeonhole.apps.submissions.models.get_upload_to,
                    ),
                ),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                (
                    "output_test",
                    models.FileField(
                        blank=True,
                        max_length=255,
                        null=True,
                        upload_to="uploads/submissions/outputs/"
                        "<django.db.models.fields.related.Foreign"
                        "Key>/<django.db.models.fields.Integer"
                        "Field>/output_test/",
                    ),
                ),
                (
                    "group_id",
                    models.ForeignKey(
                        blank=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="groups.group",
                    ),
                ),
            ],
        ),
    ]
