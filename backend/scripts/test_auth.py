"""
Test authentication endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_register():
    """Test user registration"""
    print("\n1. Testing Registration...")
    url = f"{BASE_URL}/auth/register"
    data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpass123",
        "role": "student"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_login():
    """Test user login"""
    print("\n2. Testing Login...")
    url = f"{BASE_URL}/auth/login"
    data = {
        "email": "admin@college.edu",
        "password": "admin123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200:
            return result.get("accessToken")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None


def test_get_me(token):
    """Test get current user"""
    print("\n3. Testing Get Me...")
    url = f"{BASE_URL}/auth/me"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_refresh(refresh_token):
    """Test token refresh"""
    print("\n4. Testing Token Refresh...")
    url = f"{BASE_URL}/auth/refresh"
    data = {
        "refreshToken": refresh_token
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def main():
    """Run all tests"""
    print("=" * 60)
    print("Testing Authentication Endpoints")
    print("=" * 60)
    print("\nMake sure the backend is running on http://localhost:8000")
    print("And test users are created (run: python scripts/create_test_users.py)")
    
    # Test login with existing user
    token = test_login()
    
    if token:
        # Test get me
        test_get_me(token)
    
    print("\n" + "=" * 60)
    print("Tests completed!")
    print("=" * 60)


if __name__ == "__main__":
    main()
