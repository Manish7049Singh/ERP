"""
Check database connection and tables
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import inspect, text
from app.db.session import engine
from app.models.user import User

def check_database():
    """Check database connection and tables"""
    print("=" * 60)
    print("Database Connection Check")
    print("=" * 60)
    
    try:
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✓ Database connection successful")
        
        # Check if tables exist
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        print(f"\n✓ Found {len(tables)} tables:")
        for table in tables:
            print(f"  - {table}")
        
        # Check users table specifically
        if 'users' in tables:
            print("\n✓ Users table exists")
            
            # Check columns
            columns = inspector.get_columns('users')
            print(f"  Columns: {[col['name'] for col in columns]}")
            
            # Count users
            with engine.connect() as conn:
                result = conn.execute(text("SELECT COUNT(*) FROM users"))
                count = result.scalar()
                print(f"  Total users: {count}")
                
                # Show all users
                if count > 0:
                    result = conn.execute(text("SELECT id, email, name, role FROM users"))
                    print("\n  Existing users:")
                    for row in result:
                        print(f"    ID: {row[0]}, Email: {row[1]}, Name: {row[2]}, Role: {row[3]}")
        else:
            print("\n✗ Users table does NOT exist!")
            print("  Run: python scripts/setup_dev.py")
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return False
    
    print("\n" + "=" * 60)
    return True

if __name__ == "__main__":
    check_database()
