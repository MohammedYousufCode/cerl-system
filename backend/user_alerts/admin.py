from django.contrib import admin
from .models import Alert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['title', 'severity', 'region', 'is_active', 'created_at', 'expires_at']
    list_filter = ['severity', 'is_active', 'region']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at']
