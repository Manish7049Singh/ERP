"""
Test login functionality
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.security import verify_password, hash_password
from sqlalchemy import text
from app.db.session import engine

def test_login():
    """Test login with testuser@example.com"""
    print("=" * 60)
    print("Testing Login")
    print("=" * 60)
    
    email = "testuser@example.com"
    password = "testpass123"
    
    try:
        with engine.connect() as conn:
            # Get user
            result = conn.execute(
                text("SELECT id, email, name, role, password FROM users WHERE email = :email"),
                {"email": email}
            )
            user = result.fetchone()
            
            if not user:
                print(f"✗ User not found: {email}")
                return
            
            print(f"✓ User found:")
            print(f"  ID: {user[0]}")
            print(f"  Email: {user[1]}")
            print(f"  Name: {user[2]}")
            print(f"  Role: {user[3]}")
            print(f"  Password hash: {user[4][:50]}...")
            
            # Test password
            print(f"\nTesting password: '{password}'")
            is_valid = verify_password(password, user[4])
            
            if is_valid:
                print("✓ Password is CORRECT!")
            else:
                print("✗ Password is INCORRECT!")
                print("\nTrying to hash the password to compare:")
                new_hash = hash_password(password)
                print(f"  New hash: {new_hash[:50]}...")
                print(f"  Stored hash: {user[4][:50]}...")
                
    except Exception as e:
        print(f"✗ Error: {e}")
    
    print("=" * 60)

if __name__ == "__main__":
    test_login()
