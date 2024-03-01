# Generated by Django 5.0.2 on 2024-02-28 17:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('projects', '0001_initial'),
        ('users', '0003_student_project'),
    ]

    operations = [
        migrations.CreateModel(
            name='Submissions',
            fields=[
                ('submission_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('file', models.FileField(
                    upload_to='uploads/<django.db.models.fields.related.ForeignKey>/'
                              '<django.db.models.fields.related.ForeignKey>/')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('project_id',
                 models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='projects.project')),
                ('student_id',
                 models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='users.student')),
            ],
        ),
    ]