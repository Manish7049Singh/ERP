"""
Script to create test users for each role
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password


def create_test_users():
    """Create test users for all roles"""
    db = SessionLocal()
    
    test_users = [
        {
            "name": "Admin User",
            "email": "admin@college.edu",
            "password": "admin123",
            "role": "admin"
        },
        {
            "name": "Faculty User",
            "email": "faculty@college.edu",
            "password": "faculty123",
            "role": "faculty"
        },
        {
            "name": "Student User",
            "email": "student@college.edu",
            "password": "student123",
            "role": "student"
        },
        {
            "name": "Accountant User",
            "email": "accountant@college.edu",
            "password": "acc123",
            "role": "accountant"
        }
    ]
    
    try:
        for user_data in test_users:
            # Check if user already exists
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            
            if existing_user:
                print(f"✓ User {user_data['email']} already exists")
                continue
            
            # Create new user
            hashed_password = hash_password(user_data["password"])
            new_user = User(
                name=user_data["name"],
                email=user_data["email"],
                password=hashed_password,
                role=user_data["role"]
            )
            
            db.add(new_user)
            db.commit()
            print(f"✓ Created user: {user_data['email']} (password: {user_data['password']})")
        
        print("\n✅ Test users created successfully!")
        print("\nLogin credentials:")
        print("-" * 50)
        for user_data in test_users:
            print(f"{user_data['role'].upper():12} | {user_data['email']:25} | {user_data['password']}")
        print("-" * 50)
        
    except Exception as e:
        print(f"❌ Error creating test users: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_test_users()
