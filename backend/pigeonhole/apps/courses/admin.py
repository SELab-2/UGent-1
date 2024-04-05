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
    )


admin.site.register(Course, CourseAdmin)
