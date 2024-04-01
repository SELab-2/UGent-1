# Generated by Django 4.2.11 on 2024-04-01 15:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('project_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=256)),
                ('description', models.TextField()),
                ('deadline', models.DateTimeField()),
                ('visible', models.BooleanField(default=False)),
                ('max_score', models.IntegerField(default=10)),
                ('number_of_groups', models.IntegerField(default=5)),
                ('group_size', models.IntegerField(default=1)),
                ('file_structure', models.CharField(max_length=1024, null=True)),
                ('course_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.course')),
            ],
        ),
        migrations.CreateModel(
            name='Test',
            fields=[
                ('project_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='projects.project')),
                ('test_nr', models.IntegerField()),
                ('test_file_type', models.FileField(max_length=255, null=True, upload_to='uploads/projects/<django.db.models.fields.related.ForeignKey>/<django.db.models.fields.IntegerField>')),
            ],
        ),
    ]
