import mysql.connector
import socket
import subprocess
import platform
import os
import sys

def check_port_open(host, port):
    """Check if a port is open on a host"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(2)
    result = sock.connect_ex((host, port))
    sock.close()
    return result == 0

def run_command(cmd):
    """Run a command and return output"""
    try:
        return subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        return e.output
    except Exception as e:
        return f"Error running command: {str(e)}"

print("====== MySQL Connection Diagnostic Tool ======")
print(f"OS: {platform.system()} {platform.release()}")

# 1. Check if port 3306 is open
print("\n1. Checking if MySQL port is open...")
if check_port_open('localhost', 3306):
    print("✅ MySQL port 3306 is OPEN on localhost")
else:
    print("❌ MySQL port 3306 is CLOSED on localhost")
    print("   → MySQL might not be running or is using a different port")

# 2. Check MySQL service status
if platform.system() == "Windows":
    print("\n2. Checking MySQL service status...")
    service_output = run_command("sc query mysql")
    if "RUNNING" in service_output:
        print("✅ MySQL service is RUNNING")
    elif "STOPPED" in service_output:
        print("❌ MySQL service is STOPPED")
        print("   → Try starting it with: sc start mysql")
    else:
        print("❓ MySQL service not found or status unknown")
        print("   → MySQL may not be installed as a service")
        print("   → Check if it's installed through XAMPP or other methods")
elif platform.system() == "Linux" or platform.system() == "Darwin":
    print("\n2. Checking MySQL service status...")
    service_output = run_command("ps aux | grep mysql | grep -v grep")
    if service_output:
        print("✅ MySQL process is RUNNING")
    else:
        print("❌ No MySQL process found")

# 3. Test connection with different methods
print("\n3. Testing MySQL connections...")

# Default connection
print("\na. Testing connection with default config...")
try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="#Nhatfw3124",
        database="swp391",
        connection_timeout=5
    )
    print("✅ Default connection SUCCESSFUL")
    conn.close()
except Exception as e:
    print(f"❌ Default connection FAILED: {str(e)}")

# Connection with remote_user
print("\nb. Testing connection with remote_user...")
try:
    conn = mysql.connector.connect(
        host="localhost",
        user="remote_user",
        password="#Nhatfw3124",
        database="swp391",
        connection_timeout=5
    )
    print("✅ remote_user connection SUCCESSFUL")
    conn.close()
except Exception as e:
    print(f"❌ remote_user connection FAILED: {str(e)}")

# Connection with socket (Unix) or TCP
if platform.system() == "Linux" or platform.system() == "Darwin":
    print("\nc. Testing connection with Unix socket...")
    try:
        conn = mysql.connector.connect(
            unix_socket="/tmp/mysql.sock",
            user="root",
            password="#Nhatfw3124",
            database="swp391",
            connection_timeout=5
        )
        print("✅ Socket connection SUCCESSFUL")
        conn.close()
    except Exception as e:
        print(f"❌ Socket connection FAILED: {str(e)}")

# 4. Database existence check
print("\n4. Checking if database exists...")
try:
    conn = mysql.connector.connect(
        host="localhost", 
        user="root",
        password="#Nhatfw3124",
        connection_timeout=5
    )
    cursor = conn.cursor()
    cursor.execute("SHOW DATABASES LIKE 'swp391'")
    if cursor.fetchone():
        print("✅ Database 'swp391' EXISTS")
    else:
        print("❌ Database 'swp391' DOES NOT EXIST")
        print("   → Create it with: CREATE DATABASE swp391;")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"❌ Database check FAILED: {str(e)}")

# 5. Check MySQL version
print("\n5. Checking MySQL version...")
mysql_ver = run_command("mysql --version")
if "mysql" in mysql_ver.lower():
    print(f"✅ MySQL version: {mysql_ver.strip()}")
else:
    print("❌ MySQL client not found in PATH")

print("\n====== Possible solutions ======")
print("1. Make sure MySQL is installed and running")
print("2. Create the database: CREATE DATABASE swp391;")
print("3. Use these settings in your .env file:")
print("   DB_HOST=127.0.0.1 (instead of localhost)")
print("   DB_USER=root")
print("   DB_PASSWORD=#Nhatfw3124")
print("   DB_NAME=swp391")
print("4. Try connecting with a different client like MySQL Workbench")
print("5. If you're using XAMPP, make sure it's running")
print("6. Check your firewall settings")
print("7. Try reinstalling MySQL") 