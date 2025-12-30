import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cerl_project.settings')
django.setup()

from django.contrib.auth import authenticate
from core_resources.models import User
from rest_framework_simplejwt.tokens import RefreshToken

print("=" * 60)
print("TESTING LOGIN FUNCTIONALITY")
print("=" * 60)

# Test users
test_credentials = [
    ('admin', 'Yousuf@2005'),
    ('testuser', 'test123'),
    ('CyberHIBs', None),  # Don't know password
    ('hello', None),  # Don't know password
]

for username, password in test_credentials:
    print(f"\n{'=' * 60}")
    print(f"Testing user: {username}")
    print(f"{'=' * 60}")
    
    try:
        user = User.objects.get(username=username)
        print(f"✅ User exists in database")
        print(f"   - ID: {user.id}")
        print(f"   - Email: {user.email}")
        print(f"   - Role: {user.role}")
        print(f"   - Is Active: {user.is_active}")
        print(f"   - Is Approved: {user.is_approved}")
        print(f"   - Is Superuser: {user.is_superuser}")
        print(f"   - Has usable password: {user.has_usable_password()}")
        
        if password:
            print(f"\nTesting authentication...")
            auth_user = authenticate(username=username, password=password)
            
            if auth_user:
                print(f"✅ Authentication SUCCESSFUL")
                
                # Check approval status
                if not auth_user.is_approved:
                    print(f"⚠️  WARNING: User is NOT APPROVED")
                else:
                    print(f"✅ User is APPROVED")
                
                # Try generating JWT token
                try:
                    refresh = RefreshToken.for_user(auth_user)
                    print(f"✅ JWT Token generation SUCCESSFUL")
                    print(f"   - Access token (first 50 chars): {str(refresh.access_token)[:50]}...")
                    print(f"   - Refresh token (first 50 chars): {str(refresh)[:50]}...")
                except Exception as e:
                    print(f"❌ JWT Token generation FAILED: {e}")
            else:
                print(f"❌ Authentication FAILED - Invalid credentials")
                # Check if password is correct
                if user.check_password(password):
                    print(f"✅ Password is correct (check_password)")
                else:
                    print(f"❌ Password is INCORRECT (check_password)")
        else:
            print(f"⏭️  Skipping authentication test (password unknown)")
            
    except User.DoesNotExist:
        print(f"❌ User does NOT exist in database")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

print("\n" + "=" * 60)
print("TESTING COMPLETE")
print("=" * 60)

# Print recommendation
print("\n📋 RECOMMENDATIONS:")
print("1. Try logging in with:")
print("   - Username: admin")
print("   - Password: Yousuf@2005")
print("\n2. Or with:")
print("   - Username: testuser")
print("   - Password: test123")
