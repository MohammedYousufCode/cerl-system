import os

required_files = [
    'manage.py',
    '.env',
    'requirements.txt',
    'cerl_project/__init__.py',
    'cerl_project/settings.py',
    'cerl_project/urls.py',
    'cerl_project/wsgi.py',
    'cerl_project/asgi.py',
    'core_resources/__init__.py',
    'core_resources/models.py',
    'core_resources/views.py',
    'core_resources/serializers.py',
    'core_resources/urls.py',
    'core_resources/admin.py',
    'core_resources/apps.py',
    'user_alerts/__init__.py',
    'user_alerts/models.py',
    'user_alerts/views.py',
    'user_alerts/serializers.py',  # THIS WAS MISSING!
    'user_alerts/urls.py',
    'user_alerts/admin.py',
    'user_alerts/apps.py',
]

print("=" * 50)
print("CERL Backend File Check")
print("=" * 50)

missing = []
found = []

for file in required_files:
    if os.path.exists(file):
        found.append(file)
        print(f"✓ {file}")
    else:
        missing.append(file)
        print(f"✗ MISSING: {file}")

print("=" * 50)
print(f"Found: {len(found)}/{len(required_files)}")
print(f"Missing: {len(missing)}")

if missing:
    print("\n⚠️ CREATE THESE FILES:")
    for file in missing:
        print(f"  - {file}")
else:
    print("\n✅ All required files exist!")
