# Generated by Django 5.0.2 on 2024-04-13 11:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('group_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('group_nr', models.IntegerField(blank=True, null=True)),
                ('feedback', models.TextField(null=True)),
                ('final_score', models.IntegerField(blank=True, null=True)),
                ('visible', models.BooleanField(default=False)),
                ('project_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projects.project')),
            ],
        ),
    ]
