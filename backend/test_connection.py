import mysql.connector

# Try local connection
try:
    print("Testing connection to localhost...")
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="#Nhatfw3124",
        database="swp391"
    )
    print("✅ Connection to localhost successful!")
    conn.close()
except Exception as e:
    print(f"❌ Error connecting to localhost: {e}")

# Check if MySQL service is running
import subprocess
import platform

if platform.system() == "Windows":
    try:
        print("\nChecking if MySQL service is running...")
        result = subprocess.run(["sc", "query", "mysql"], capture_output=True, text=True)
        if "RUNNING" in result.stdout:
            print("✅ MySQL service is running")
        else:
            print("❌ MySQL service is NOT running")
    except:
        print("❌ Could not check MySQL service status") 