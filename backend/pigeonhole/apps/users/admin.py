from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from backend.pigeonhole.apps.users.models import User


class UserAdmin(BaseUserAdmin):
    list_display = (
        'username',
        'first_name',
        'last_name',
        'id',
        'email',
    )
    search_fields = (
        'username',
        'id',
        'email',
        'first_name',
        'last_name',
    )
    ordering = (
        'username',
    )

    fieldsets = (
        (
            None,
            {
                'fields': (
                    'username',
                    'email',
                    'password',
                    'first_name',
                    'last_name',
                )
            }
        ),
        (
            'Courses',
            {
                'fields': (
                    'course',
                )
            }
        ),
        (
            'Permissions',
            {
                'fields': (
                    'role',
                )
            }
        ),
    )

    raw_id_fields = (
        'course',
    )


admin.site.register(User, UserAdmin)
