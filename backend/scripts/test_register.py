"""
Test user registration endpoint
"""
import requests
import json
import random
import string

BASE_URL = "http://localhost:8000/api/v1"

def generate_random_email():
    """Generate a random email for testing"""
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_{random_string}@example.com"

def test_register_student():
    """Test registering a new student"""
    print("\n1. Testing Student Registration...")
    url = f"{BASE_URL}/auth/register"
    data = {
        "name": "Test Student",
        "email": generate_random_email(),
        "password": "testpass123",
        "role": "student"
    }
    
    print(f"Request: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_register_faculty():
    """Test registering a new faculty"""
    print("\n2. Testing Faculty Registration...")
    url = f"{BASE_URL}/auth/register"
    data = {
        "name": "Test Faculty",
        "email": generate_random_email(),
        "password": "testpass123",
        "role": "faculty"
    }
    
    print(f"Request: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_register_duplicate():
    """Test registering with duplicate email"""
    print("\n3. Testing Duplicate Email (Should Fail)...")
    url = f"{BASE_URL}/auth/register"
    
    # Use existing test user email
    data = {
        "name": "Duplicate User",
        "email": "admin@college.edu",  # This already exists
        "password": "testpass123",
        "role": "student"
    }
    
    print(f"Request: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 409:
            print("✓ Correctly rejected duplicate email")
            return True
        else:
            print("✗ Should have returned 409 Conflict")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_register_invalid_data():
    """Test registering with invalid data"""
    print("\n4. Testing Invalid Data (Should Fail)...")
    url = f"{BASE_URL}/auth/register"
    
    # Missing required field
    data = {
        "name": "Test",
        "email": "invalid-email",  # Invalid email format
        "password": "short",  # Too short
        "role": "student"
    }
    
    print(f"Request: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 422:
            print("✓ Correctly rejected invalid data")
            return True
        else:
            print("✗ Should have returned 422 Validation Error")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_register_and_login():
    """Test complete flow: register then login"""
    print("\n5. Testing Register + Login Flow...")
    
    # Register
    register_url = f"{BASE_URL}/auth/register"
    email = generate_random_email()
    password = "testpass123"
    
    register_data = {
        "name": "Test User Flow",
        "email": email,
        "password": password,
        "role": "student"
    }
    
    print(f"Step 1: Register")
    print(f"Request: {json.dumps(register_data, indent=2)}")
    
    try:
        register_response = requests.post(register_url, json=register_data)
        print(f"Status: {register_response.status_code}")
        print(f"Response: {json.dumps(register_response.json(), indent=2)}")
        
        if register_response.status_code != 200:
            print("✗ Registration failed")
            return False
        
        print("\n✓ Registration successful")
        
        # Login
        print(f"\nStep 2: Login with new account")
        login_url = f"{BASE_URL}/auth/login"
        login_data = {
            "email": email,
            "password": password
        }
        
        print(f"Request: {json.dumps(login_data, indent=2)}")
        
        login_response = requests.post(login_url, json=login_data)
        print(f"Status: {login_response.status_code}")
        print(f"Response: {json.dumps(login_response.json(), indent=2)}")
        
        if login_response.status_code == 200:
            print("\n✓ Login successful")
            print("✓ Complete flow working!")
            return True
        else:
            print("\n✗ Login failed")
            return False
            
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Run all registration tests"""
    print("=" * 60)
    print("Testing User Registration")
    print("=" * 60)
    print("\nMake sure the backend is running on http://localhost:8000")
    
    results = []
    
    # Run tests
    results.append(("Student Registration", test_register_student()))
    results.append(("Faculty Registration", test_register_faculty()))
    results.append(("Duplicate Email Check", test_register_duplicate()))
    results.append(("Invalid Data Check", test_register_invalid_data()))
    results.append(("Register + Login Flow", test_register_and_login()))
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    for test_name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status:8} | {test_name}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    
    print("=" * 60)
    print(f"Total: {passed}/{total} tests passed")
    print("=" * 60)

if __name__ == "__main__":
    main()
