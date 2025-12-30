import requests
import json

print("=" * 60)
print("TESTING API ENDPOINT")
print("=" * 60)

# Test URLs
urls = [
    'http://127.0.0.1:8000/api/auth/login/',
    'http://localhost:8000/api/auth/login/',
    'http://10.39.115.247:8000/api/auth/login/',
]

credentials = {
    'username': 'testuser',
    'password': 'test123'
}

for url in urls:
    print(f"\n{'=' * 60}")
    print(f"Testing: {url}")
    print(f"{'=' * 60}")
    
    try:
        response = requests.post(
            url,
            json=credentials,
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body:")
        try:
            print(json.dumps(response.json(), indent=2))
        except:
            print(response.text)
            
        if response.status_code == 200:
            print(f"✅ LOGIN SUCCESSFUL!")
        else:
            print(f"❌ LOGIN FAILED!")
            
    except requests.exceptions.ConnectionError as e:
        print(f"❌ CONNECTION ERROR: Server is not running at {url}")
    except requests.exceptions.Timeout:
        print(f"❌ TIMEOUT: Server took too long to respond")
    except Exception as e:
        print(f"❌ ERROR: {e}")

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)
print("\n⚠️  If all URLs failed with CONNECTION ERROR:")
print("   The backend server is NOT RUNNING!")
print("   Run: python backend/manage.py runserver")
