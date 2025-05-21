import re
import os
import shutil

def update_app_py():
    try:
        app_py_path = 'app.py'
        backup_path = 'app.py.bak2'
        
        # Create backup
        shutil.copy2(app_py_path, backup_path)
        print(f"✅ Created backup: {backup_path}")
        
        with open(app_py_path, 'r') as file:
            content = file.read()
        
        # Update db_config to use 127.0.0.1 instead of localhost
        updated_content = re.sub(
            r"db_config = \{[^}]*'host': [^,}]*[^}]*\}",
            """db_config = {
    'host': os.getenv('DB_HOST', '127.0.0.1'),  # Using IP instead of hostname
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', '#Nhatfw3124'),
    'database': os.getenv('DB_NAME', 'swp391')
}""",
            content
        )
        
        with open(app_py_path, 'w') as file:
            file.write(updated_content)
        
        print("✅ Updated app.py to use 127.0.0.1 instead of localhost")
        print("\nAlso create/update your .env file with:")
        print("DB_HOST=127.0.0.1")
        print("DB_USER=root")
        print("DB_PASSWORD=#Nhatfw3124")
        print("DB_NAME=swp391")
        
    except Exception as e:
        print(f"❌ Error updating app.py: {e}")
        print("Please update your database config manually:")
        print("""
db_config = {
    'host': '127.0.0.1',  # Using IP instead of hostname
    'user': 'root',
    'password': '#Nhatfw3124',
    'database': 'swp391'
}
""")

if __name__ == "__main__":
    update_app_py() 