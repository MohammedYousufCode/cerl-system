from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Resource, ResourceUpdate

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'is_approved', 'date_joined']
    list_filter = ['role', 'is_approved', 'is_staff']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'phone_number', 'is_approved')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role', 'phone_number', 'is_approved')}),
    )

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'region', 'status', 'available_capacity', 'verified']
    list_filter = ['type', 'status', 'verified', 'region']
    search_fields = ['name', 'description', 'address']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(ResourceUpdate)
class ResourceUpdateAdmin(admin.ModelAdmin):
    list_display = ['resource', 'coordinator', 'timestamp', 'previous_capacity', 'new_capacity']
    list_filter = ['timestamp']
    readonly_fields = ['timestamp']
