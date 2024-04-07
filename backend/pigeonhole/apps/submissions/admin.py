from django.contrib import admin

from backend.pigeonhole.apps.submissions.models import Submissions


class SubmissionAdmin(admin.ModelAdmin):
    list_display = (
        'submission_id',
        'group_id',
        'submission_nr',
    )
    search_fields = (
        'submission_id',
        'group_id',
        'submission_nr',
    )
    ordering = (
        'submission_id',
    )

    fieldsets = (
        (
            None,
            {
                'fields': (
                    'submission_nr',
                )
            }
        ),
        (
            'Group',
            {
                'fields': (
                    'group_id',
                )
            }
        ),
        (
            'Files',
            {
                'fields': (
                    'file',
                )
            }
        ),
        (
            'Tests',
            {
                'fields': (
                    'output_test',
                )
            }
        ),
    )

    raw_id_fields = (
        'group_id',
    )


admin.site.register(Submissions, SubmissionAdmin)