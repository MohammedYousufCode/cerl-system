from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db import models
from django.db.models import Q
from django.http import HttpResponse
import csv
import math

from .models import User, Resource, ResourceUpdate
from .serializers import UserSerializer, ResourceSerializer, ResourceUpdateSerializer


def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points in kilometers"""
    R = 6371  # Earth radius in km
    
    lat1, lon1, lat2, lon2 = map(math.radians, [float(lat1), float(lon1), float(lat2), float(lon2)])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """User registration endpoint"""
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': serializer.data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """User login endpoint"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if user:
        if not user.is_active:
            return Response(
                {'error': 'Your account has been deactivated'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if not user.is_approved:
            return Response(
                {'error': 'Your account is pending approval'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        refresh = RefreshToken.for_user(user)
        serializer = UserSerializer(user)
        
        return Response({
            'user': serializer.data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    
    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get current authenticated user"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    """Admin user management"""
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    
    def get_queryset(self):
        # Only return essential fields for list view
        return User.objects.all().order_by('-date_joined').only(
            'id', 'username', 'email', 'role', 'phone_number', 
            'is_approved', 'date_joined', 'first_name', 'last_name'
        )

    def get_permissions(self):
        # Only admins can list/update users
        if self.action in ['list', 'retrieve', 'partial_update', 'update', 'approve']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def list(self, request, *args, **kwargs):
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can view users'}, status=status.HTTP_403_FORBIDDEN)
        return super().list(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can update users'}, status=status.HTTP_403_FORBIDDEN)
        # Prevent password updates via this endpoint
        data = request.data.copy()
        data.pop('password', None)
        serializer = self.get_serializer(self.get_object(), data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a coordinator/admin"""
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can approve users'}, status=status.HTTP_403_FORBIDDEN)
        user = self.get_object()
        user.is_approved = True
        user.save()
        return Response(UserSerializer(user).data)


class ResourceViewSet(viewsets.ModelViewSet):
    """Resource management endpoints"""
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'nearby']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        # Optimize queries with select_related to avoid N+1 queries
        queryset = Resource.objects.select_related('coordinator', 'verified_by').all()
        
        # Filter by coordinator (for coordinator dashboard)
        if self.request.user.is_authenticated and self.request.user.role == 'coordinator':
            queryset = queryset.filter(coordinator=self.request.user)
        
        # Filter by type
        resource_type = self.request.query_params.get('type')
        if resource_type:
            queryset = queryset.filter(type=resource_type)
        
        # Filter by status
        resource_status = self.request.query_params.get('status')
        if resource_status:
            queryset = queryset.filter(status=resource_status)
        
        # Filter by region
        region = self.request.query_params.get('region')
        if region:
            queryset = queryset.filter(region__icontains=region)
        
        # Search by name
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """Find nearby resources within radius"""
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        max_distance = float(request.query_params.get('max_distance', 10))  # km
        
        if not lat or not lon:
            return Response(
                {'error': 'Latitude and longitude required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        resources = self.get_queryset()
        nearby_resources = []
        
        for resource in resources:
            distance = haversine_distance(lat, lon, resource.latitude, resource.longitude)
            
            if distance <= max_distance:
                resource.distance = round(distance, 2)
                nearby_resources.append(resource)
        
        # Sort by distance
        nearby_resources.sort(key=lambda x: x.distance)
        
        serializer = self.get_serializer(nearby_resources, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify a resource (admin only)"""
        if request.user.role != 'admin':
            return Response(
                {'error': 'Only admins can verify resources'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        resource = self.get_object()
        resource.verified = True
        resource.verified_by = request.user
        resource.save()
        
        serializer = self.get_serializer(resource)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_capacity(self, request, pk=None):
        """Update resource capacity (coordinator/admin)"""
        if request.user.role not in ['coordinator', 'admin']:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        resource = self.get_object()
        
        # Coordinators can only update their assigned resources
        if request.user.role == 'coordinator' and resource.coordinator != request.user:
            return Response(
                {'error': 'You can only update your assigned resources'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        new_capacity = request.data.get('available_capacity')
        
        if new_capacity is None:
            return Response(
                {'error': 'available_capacity required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create audit log
        ResourceUpdate.objects.create(
            resource=resource,
            coordinator=request.user,
            change_log=request.data.get('change_log', 'Capacity updated'),
            previous_capacity=resource.available_capacity,
            new_capacity=new_capacity
        )
        
        resource.available_capacity = new_capacity
        
        # Auto-update status based on capacity
        if new_capacity == 0:
            resource.status = 'full'
        elif resource.status == 'full' and new_capacity > 0:
            resource.status = 'open'
        
        resource.save()
        
        serializer = self.get_serializer(resource)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def assign_coordinator(self, request, pk=None):
        """Assign coordinator to resource (admin only)"""
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can assign coordinators'}, status=status.HTTP_403_FORBIDDEN)

        coordinator_id = request.data.get('coordinator_id')
        if not coordinator_id:
            return Response({'error': 'coordinator_id required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            coordinator = User.objects.get(id=coordinator_id, role='coordinator')
        except User.DoesNotExist:
            return Response({'error': 'Coordinator not found'}, status=status.HTTP_404_NOT_FOUND)

        resource = self.get_object()
        resource.coordinator = coordinator
        resource.save()
        serializer = self.get_serializer(resource)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Basic analytics summary (admin)"""
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can view stats'}, status=status.HTTP_403_FORBIDDEN)
        # Use single query with aggregation for better performance
        total = Resource.objects.count()
        by_type = Resource.objects.values('type').annotate(count=models.Count('id')).order_by('type')
        by_status = Resource.objects.values('status').annotate(count=models.Count('id')).order_by('status')
        verified = Resource.objects.filter(verified=True).count()
        return Response({
            'total_resources': total,
            'verified_resources': verified,
            'by_type': list(by_type),
            'by_status': list(by_status),
        })

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        """Export resources as CSV (admin)"""
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can export'}, status=status.HTTP_403_FORBIDDEN)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="resources.csv"'

        writer = csv.writer(response)
        writer.writerow(['Name', 'Type', 'Status', 'Latitude', 'Longitude', 'Region', 'Capacity', 'Available', 'Verified', 'Coordinator'])
        # Optimize query with select_related to avoid N+1 queries
        for r in Resource.objects.select_related('coordinator').all():
            writer.writerow([
                r.name, r.type, r.status, r.latitude, r.longitude, r.region,
                r.capacity, r.available_capacity, r.verified,
                r.coordinator.get_full_name() if r.coordinator else ''
            ])
        return response


class ResourceUpdateViewSet(viewsets.ReadOnlyModelViewSet):
    """Resource update history"""
    queryset = ResourceUpdate.objects.select_related('coordinator', 'resource').all()
    serializer_class = ResourceUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Optimize with select_related and limit results
        queryset = ResourceUpdate.objects.select_related('coordinator', 'resource').all()
        
        # Filter by resource
        resource_id = self.request.query_params.get('resource')
        if resource_id:
            queryset = queryset.filter(resource_id=resource_id)
        
        # Order by timestamp descending
        queryset = queryset.order_by('-timestamp')
        
        # Limit to latest 50 by default for performance
        limit = int(self.request.query_params.get('limit', 50))
        if limit > 0:
            queryset = queryset[:limit]
        
        return queryset
