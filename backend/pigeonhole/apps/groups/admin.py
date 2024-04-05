from django.contrib import admin

from backend.pigeonhole.apps.groups.models import Group


class GroupAdmin(admin.ModelAdmin):
    list_display = (
        'group_id',
        'group_nr',
        'project_id',
    )
    search_fields = (
        'group_id',
        'group_nr',
        'project_id',
    )
    ordering = (
        'group_id',
    )

    fieldsets = (
        (
            None,
            {
                'fields': (
                    'group_nr',
                    'project_id',
                )
            }
        ),
        (
            'Group members',
            {
                'fields': (
                    'user',
                )
            }
        ),
        (
            'Evaluation',
            {
                'fields': (
                    'final_score',
                    'feedback',
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
    )

    raw_id_fields = (
        'project_id',
        'user',
    )


admin.site.register(Group, GroupAdmin)
