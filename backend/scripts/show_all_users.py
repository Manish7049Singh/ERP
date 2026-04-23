"""
Show all users in database
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import text
from app.db.session import engine

def show_users():
    """Display all users"""
    print("\n" + "=" * 80)
    print("ALL USERS IN DATABASE")
    print("=" * 80)
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT id, name, email, role FROM users ORDER BY id"))
            users = result.fetchall()
            
            if not users:
                print("No users found in database!")
            else:
                print(f"\nTotal Users: {len(users)}\n")
                print(f"{'ID':<5} {'Name':<25} {'Email':<35} {'Role':<15}")
                print("-" * 80)
                
                for user in users:
                    print(f"{user[0]:<5} {user[1]:<25} {user[2]:<35} {user[3]:<15}")
                
                print("\n" + "=" * 80)
                print("\nYou can login with any of these emails!")
                print("Default passwords:")
                print("  - admin@college.edu / admin123")
                print("  - student@college.edu / student123")
                print("  - faculty@college.edu / faculty123")
                print("  - testuser@example.com / testpass123")
                print("=" * 80 + "\n")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    show_users()
