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
            'Simple evaluation',
            {
                'fields': (
                    'output_simple_test',
                    'feedback_simple_test',
                )
            }
        ),
        (
            'Advanced evaluation',
            {
                'fields': (
                    'eval_result',
                    'eval_output',
                )
            }
        ),
        (
            'file urls',
            {
                'fields': (
                    'file_urls',
                )
            }
        ),
    )

    raw_id_fields = (
        'group_id',
    )


admin.site.register(Submissions, SubmissionAdmin)
