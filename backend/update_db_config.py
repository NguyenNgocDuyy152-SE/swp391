import re
import os
import shutil

def update_app_py():
    try:
        app_py_path = 'app.py'
        backup_path = 'app.py.bak'
        
        # Create backup
        shutil.copy2(app_py_path, backup_path)
        print(f"✅ Created backup: {backup_path}")
        
        with open(app_py_path, 'r') as file:
            content = file.read()
        
        # Update db_config with remote_user
        updated_content = re.sub(
            r"db_config = \{[^}]*'user': [^,}]*[^}]*'password': [^,}]*[^}]*\}",
            """db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),  # Use localhost for local testing
    'user': os.getenv('DB_USER', 'remote_user'),
    'password': os.getenv('DB_PASSWORD', '#Nhatfw3124'),
    'database': os.getenv('DB_NAME', 'swp391')
}""",
            content
        )
        
        with open(app_py_path, 'w') as file:
            file.write(updated_content)
        
        print("✅ Updated app.py with remote_user configuration")
        print("\nRemember to also create/update your .env file with:")
        print("DB_HOST=localhost")
        print("DB_USER=remote_user")
        print("DB_PASSWORD=#Nhatfw3124")
        print("DB_NAME=swp391")
        
    except Exception as e:
        print(f"❌ Error updating app.py: {e}")
        print("Please update your database config manually:")
        print("""
db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'remote_user'),
    'password': os.getenv('DB_PASSWORD', '#Nhatfw3124'),
    'database': os.getenv('DB_NAME', 'swp391')
}
""")

if __name__ == "__main__":
    update_app_py() 