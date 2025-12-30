from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from django.db import models

from .models import Alert
from .serializers import AlertSerializer

class AlertViewSet(viewsets.ModelViewSet):
    """Alert management endpoints"""
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'active']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        # Only admins can create alerts
        if self.request.user.role != 'admin':
            raise PermissionError('Only admins can create alerts')
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active alerts"""
        now = timezone.now()
        alerts = Alert.objects.filter(
            is_active=True
        ).filter(
            models.Q(expires_at__isnull=True) | models.Q(expires_at__gt=now)
        )
        
        # Filter by region if provided
        region = request.query_params.get('region')
        if region:
            alerts = alerts.filter(region__icontains=region)
        
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)
