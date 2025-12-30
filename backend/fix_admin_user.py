import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cerl_project.settings')
django.setup()

from core_resources.models import User

print("=" * 60)
print("FIXING ADMIN USER")
print("=" * 60)

# Delete existing admin user if exists (to recreate fresh)
User.objects.filter(username='admin').delete()
print("🗑️  Removed old admin user (if existed)")

# Create fresh admin user
admin_user = User.objects.create_superuser(
    username='admin',
    password='Yousuf@2005',
    email='admin@cerl.local',
    role='admin'
)

# Ensure admin is approved and active
admin_user.is_approved = True
admin_user.is_active = True
admin_user.is_staff = True
admin_user.is_superuser = True
admin_user.save()

print("✅ Created admin user")

print(f"\n📋 Admin User Details:")
print(f"   Username: {admin_user.username}")
print(f"   Email: {admin_user.email}")
print(f"   Role: {admin_user.role}")
print(f"   Is Active: {admin_user.is_active}")
print(f"   Is Approved: {admin_user.is_approved}")
print(f"   Is Superuser: {admin_user.is_superuser}")

# Test authentication
from django.contrib.auth import authenticate
test_auth = authenticate(username='admin', password='Yousuf@2005')
if test_auth:
    print(f"\n✅ Authentication test: SUCCESS")
    print(f"   You can now login with:")
    print(f"   Username: admin")
    print(f"   Password: Yousuf@2005")
else:
    print(f"\n❌ Authentication test: FAILED")
    print(f"   Password might not be set correctly")

print("\n" + "=" * 60)
print("DONE!")
print("=" * 60)

