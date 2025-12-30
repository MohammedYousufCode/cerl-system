from rest_framework import serializers
from .models import User, Resource, ResourceUpdate

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'phone_number', 
                  'is_approved', 'date_joined', 'first_name', 'last_name']
        read_only_fields = ['id', 'date_joined']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'citizen'),
            phone_number=validated_data.get('phone_number', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class ResourceSerializer(serializers.ModelSerializer):
    distance = serializers.SerializerMethodField(read_only=True)
    coordinator_name = serializers.SerializerMethodField(read_only=True)
    verified_by_name = serializers.SerializerMethodField(read_only=True)
    
    def get_coordinator_name(self, obj):
        if obj.coordinator:
            return obj.coordinator.get_full_name() or obj.coordinator.username
        return None
    
    def get_verified_by_name(self, obj):
        if obj.verified_by:
            return obj.verified_by.get_full_name() or obj.verified_by.username
        return None
    
    class Meta:
        model = Resource
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'verified', 'verified_by']
    
    def get_distance(self, obj):
        # Distance will be calculated in the view
        return getattr(obj, 'distance', None)
    
    def validate(self, data):
        if data.get('available_capacity', 0) > data.get('capacity', 0):
            raise serializers.ValidationError(
                "Available capacity cannot exceed total capacity"
            )
        return data


class ResourceUpdateSerializer(serializers.ModelSerializer):
    coordinator_name = serializers.SerializerMethodField(read_only=True)
    resource_name = serializers.CharField(source='resource.name', read_only=True)
    
    def get_coordinator_name(self, obj):
        if obj.coordinator:
            return obj.coordinator.get_full_name() or obj.coordinator.username
        return None
    
    class Meta:
        model = ResourceUpdate
        fields = '__all__'
        read_only_fields = ['timestamp']
