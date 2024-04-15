from django.contrib import admin

from backend.pigeonhole.apps.courses.models import Course


class CourseAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'course_id',
    )
    search_fields = (
        'name',
        'course_id',
        'description',
    )
    ordering = (
        'course_id',
    )
    readonly_fields = (
        'invite_token',
    )

    fieldsets = (
        (
            None,
            {
                'fields': (
                    'name',
                    'description',
                )
            }
        ),
        (
            'Invites',
            {
                'fields': (
                    'invite_token',
                    'open_course',
                )
            }
        )
    )


admin.site.register(Course, CourseAdmin)
