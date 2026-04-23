"""
Development setup script
Creates database tables and seeds test data
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.session import engine, Base
from app.db import base  # Import all models
from create_test_users import create_test_users


def setup_database():
    """Create all database tables"""
    print("Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False
    return True


def main():
    """Main setup function"""
    print("=" * 50)
    print("College ERP - Development Setup")
    print("=" * 50)
    print()
    
    # Create tables
    if not setup_database():
        return
    
    print()
    
    # Create test users
    print("Creating test users...")
    create_test_users()
    
    print()
    print("=" * 50)
    print("✅ Setup completed successfully!")
    print("=" * 50)
    print()
    print("Next steps:")
    print("1. Start the backend: uvicorn app.main:app --reload")
    print("2. Start the frontend: cd ../frontend && npm run dev")
    print("3. Open http://localhost:3000 and login with test credentials")
    print()


if __name__ == "__main__":
    main()
