from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser):
    """Custom User model with role-based access"""
    ROLE_CHOICES = [
        ('citizen', 'Citizen'),
        ('coordinator', 'Resource Coordinator'),
        ('admin', 'Administrator'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='citizen')
    phone_number = models.CharField(max_length=15, blank=True)
    is_approved = models.BooleanField(default=True)  # Auto-approve citizens
    
    class Meta:
        db_table = 'users'
    
    def save(self, *args, **kwargs):
        # Auto-approve citizens, require approval for coordinators/admins
        if self.role == 'citizen':
            self.is_approved = True
        super().save(*args, **kwargs)


class Resource(models.Model):
    """Emergency Resource model with location data"""
    TYPE_CHOICES = [
        ('hospital', 'Hospital'),
        ('police', 'Police Station'),
        ('fire', 'Fire Station'),
        ('shelter', 'Emergency Shelter'),
        ('food', 'Food Distribution Center'),
        ('water', 'Water Point'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('full', 'At Full Capacity'),
    ]
    
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField()
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    address = models.TextField()
    region = models.CharField(max_length=100)  # City/District
    
    capacity = models.IntegerField(validators=[MinValueValidator(0)])
    available_capacity = models.IntegerField(validators=[MinValueValidator(0)])
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    
    contact = models.CharField(max_length=15)
    helpline = models.CharField(max_length=15, blank=True)
    image = models.ImageField(upload_to='resources/', blank=True, null=True)
    
    verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='verified_resources'
    )
    coordinator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_resources',
        limit_choices_to={'role': 'coordinator'}
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'resources'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['type', 'status']),
            models.Index(fields=['latitude', 'longitude']),
            models.Index(fields=['region']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"
    
    def clean(self):
        # Ensure available_capacity doesn't exceed total capacity
        if self.available_capacity > self.capacity:
            self.available_capacity = self.capacity


class ResourceUpdate(models.Model):
    """Audit log for resource updates"""
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='updates')
    coordinator = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    change_log = models.TextField()
    previous_capacity = models.IntegerField()
    new_capacity = models.IntegerField()
    
    class Meta:
        db_table = 'resource_updates'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.resource.name} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
