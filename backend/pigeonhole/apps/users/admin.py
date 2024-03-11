from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from backend.pigeonhole.apps.users.models import User


class UserAdmin(BaseUserAdmin):
    list_display = ('email',)
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()
    fieldsets = (
        (None, {'fields': (
            'email',
            'password',
            'first_name',
            'last_name',
        )}),
    )


admin.site.register(User, UserAdmin)
