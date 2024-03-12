from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from backend.pigeonhole.apps.users.models import User


class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'id', 'email', 'first_name', 'last_name',)
    search_fields = ('username', 'id', 'email', 'first_name', 'last_name',)
    ordering = ('username',)
    filter_horizontal = ()
    fieldsets = (
        (None, {'fields': (
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
        )}),
    )


admin.site.register(User, UserAdmin)
