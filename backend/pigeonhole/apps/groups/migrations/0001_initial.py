# Generated by Django 4.2.7 on 2024-02-28 19:58

from django.db import migrations, models
import django.db.models.deletion


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
                ('group_nr', models.IntegerField()),
                ('final_score', models.IntegerField()),
                ('project_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projects.project')),
            ],
        ),
    ]
