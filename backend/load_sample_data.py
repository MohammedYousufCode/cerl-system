import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cerl_project.settings')
django.setup()

from core_resources.models import User, Resource
from user_alerts.models import Alert
from django.utils import timezone
from datetime import timedelta

print("=" * 60)
print("LOADING SAMPLE DATA FOR CERL")
print("=" * 60)

# Create test user
print("\n📝 Creating users...")
if not User.objects.filter(username='testuser').exists():
    User.objects.create_user(
        username='testuser',
        password='test123',
        email='test@example.com',
        role='citizen',
        phone_number='+919876543210',
        first_name='Test',
        last_name='User'
    )
    print("✅ Created testuser")
else:
    print("⏭️  testuser already exists")

# Create sample resources (Mysore, Karnataka) - Updated with accurate coordinates
print("\n🏥 Creating resources...")
resources_data = [
    {
        'name': 'K.R. Hospital Mysore',
        'type': 'hospital',
        'description': 'Government multi-specialty hospital with emergency services',
        'latitude': 12.3051,  # Updated accurate coordinates for K.R. Hospital
        'longitude': 76.6550,
        'address': 'Sayyaji Rao Rd, Agrahara, Chamrajpura, Mysore, Karnataka 570001',
        'region': 'Mysore',
        'capacity': 500,
        'available_capacity': 120,
        'status': 'open',
        'contact': '+918212520200',
        'helpline': '108',
        'verified': True,
    },
    {
        'name': 'Mysore Palace Emergency Shelter',
        'type': 'shelter',
        'description': 'Temporary shelter facility during disasters',
        'latitude': 12.3051,  # Updated accurate coordinates near Mysore Palace
        'longitude': 76.6553,
        'address': 'Near Mysore Palace, Mysore, Karnataka 570001',
        'region': 'Mysore',
        'capacity': 200,
        'available_capacity': 180,
        'status': 'open',
        'contact': '+918212421051',
        'verified': True,
    },
    {
        'name': 'Devaraja Police Station',
        'type': 'police',
        'description': 'City police station with emergency response',
        'latitude': 12.3062,  # Updated accurate coordinates for Devaraja Police Station
        'longitude': 76.6562,
        'address': 'Devaraja Mohalla, Mysore, Karnataka 570001',
        'region': 'Mysore',
        'capacity': 50,
        'available_capacity': 50,
        'status': 'open',
        'contact': '+918212444800',
        'helpline': '100',
        'verified': True,
    },
    {
        'name': 'Kukkarahalli Water Distribution Point',
        'type': 'water',
        'description': 'Emergency water supply point',
        'latitude': 12.3090,  # Updated accurate coordinates for Kukkarahalli
        'longitude': 76.6365,
        'address': 'Kukkarahalli, Mysore, Karnataka 570009',
        'region': 'Mysore',
        'capacity': 5000,
        'available_capacity': 4200,
        'status': 'open',
        'contact': '+918212512345',
        'verified': True,
    },
    {
        'name': 'Fire Station Saraswathipuram',
        'type': 'fire',
        'description': '24/7 fire and rescue services',
        'latitude': 12.3167,  # Updated accurate coordinates for Saraswathipuram Fire Station
        'longitude': 76.6389,
        'address': 'Saraswathipuram, Mysore, Karnataka 570009',
        'region': 'Mysore',
        'capacity': 30,
        'available_capacity': 30,
        'status': 'open',
        'contact': '+918212425000',
        'helpline': '101',
        'verified': True,
    },
    {
        'name': 'Apollo BGS Hospital',
        'type': 'hospital',
        'description': 'Private multi-specialty hospital with 24/7 emergency',
        'latitude': 12.2958,  # Accurate coordinates for Apollo BGS Hospital
        'longitude': 76.6394,
        'address': 'Adichunchanagiri Road, Kuvempunagar, Mysore, Karnataka 570023',
        'region': 'Mysore',
        'capacity': 300,
        'available_capacity': 85,
        'status': 'open',
        'contact': '+918212570000',
        'helpline': '108',
        'verified': True,
    },
    {
        'name': 'Food Distribution Center - City Market',
        'type': 'food',
        'description': 'Emergency food distribution point',
        'latitude': 12.3075,
        'longitude': 76.6533,
        'address': 'City Market, Mysore, Karnataka 570001',
        'region': 'Mysore',
        'capacity': 1000,
        'available_capacity': 750,
        'status': 'open',
        'contact': '+918212500000',
        'verified': True,
    },
]

for data in resources_data:
    obj, created = Resource.objects.get_or_create(
        name=data['name'],
        defaults=data
    )
    if created:
        print(f"✅ Created resource: {data['name']}")
    else:
        print(f"⏭️  Resource already exists: {data['name']}")

# Create sample alerts - FORCE RECREATE
print("\n🚨 Creating alerts...")

# Delete old expired alerts
Alert.objects.filter(expires_at__lt=timezone.now()).delete()

# Get admin user
admin_user = User.objects.filter(role='admin').first()

if not admin_user:
    print("❌ No admin user found! Creating one...")
    admin_user = User.objects.create_superuser(
        username='admin',
        password='Yousuf@2005',
        email='admin@cerl.local',
        role='admin'
    )
    print("✅ Admin user created")

# Delete existing active alerts to recreate
Alert.objects.filter(title='Heavy Rainfall Warning', region='Mysore').delete()
Alert.objects.filter(title='Hospital Capacity Update', region='Mysore').delete()

# Create high severity alert
alert1 = Alert.objects.create(
    title='🚨 Heavy Rainfall Warning',
    description='Heavy rain expected in Mysore city for next 48 hours. Avoid low-lying areas, stay indoors if possible, and keep emergency contacts ready.',
    severity='high',
    region='Mysore',
    is_active=True,
    created_by=admin_user,
    expires_at=timezone.now() + timedelta(days=2)
)
print(f"✅ Created HIGH severity alert: {alert1.title}")
print(f"   Expires: {alert1.expires_at}")

# Create medium severity alert
alert2 = Alert.objects.create(
    title='⚠️ Hospital Capacity Update',
    description='K.R. Hospital Mysore is currently at 75% capacity. Alternative emergency services available at nearby facilities.',
    severity='medium',
    region='Mysore',
    is_active=True,
    created_by=admin_user,
    expires_at=None  # Never expires
)
print(f"✅ Created MEDIUM severity alert: {alert2.title}")

# Verify
print("\n" + "=" * 60)
print("VERIFICATION")
print("=" * 60)
print(f"✅ Total Users: {User.objects.count()}")
print(f"✅ Total Resources: {Resource.objects.count()}")
print(f"✅ Total Active Alerts: {Alert.objects.filter(is_active=True).count()}")

print("\n🎉 Sample data loaded successfully!")
print("\nRefresh your frontend to see the alerts!")
