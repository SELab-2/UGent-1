from django.contrib import admin

from backend.pigeonhole.apps.projects.models import Project


class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'project_id',
    )
    search_fields = (
        'name',
        'project_id',
        'description',
    )
    ordering = (
        'project_id',
    )

    fieldsets = (
        (
            None,
            {
                'fields': (
                    'name',
                    'description',
                    'deadline',
                    'max_score',
                )
            }
        ),
        (
            'Course',
            {
                'fields': (
                    'course_id',
                )
            }
        ),
        (
            'Groups',
            {
                'fields': (
                    'number_of_groups',
                    'group_size',
                )
            }
        ),
        (
            'Files',
            {
                'fields': (
                    'file_structure',
                    'conditions',
                )
            }
        ),
        (
            'Visibility',
            {
                'fields': (
                    'visible',
                )
            }
        ),
        (
            'test docker image',
            {
                'fields': (
                    'test_docker_image',
                )
            }
        ),
    )

    raw_id_fields = (
        'course_id',
    )


admin.site.register(Project, ProjectAdmin)
