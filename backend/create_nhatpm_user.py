import mysql.connector
import sys

def create_nhatpm_user():
    try:
        # Connect to MySQL as root
        print("Connecting to MySQL as root...")
        root_password = "#Nhatfw3124"  # Using the provided password directly
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password=root_password
        )
        
        cursor = conn.cursor()
        
        # Create nhatpm user if it doesn't exist
        print("Creating nhatpm user with access from any host...")
        cursor.execute("CREATE USER IF NOT EXISTS 'nhatpm'@'%' IDENTIFIED BY '#Nhatfw3124'")
        
        # Create database if it doesn't exist
        print("Creating swp391 database if it doesn't exist...")
        cursor.execute("CREATE DATABASE IF NOT EXISTS swp391")
        
        # Grant all privileges on the swp391 database
        print("Granting privileges on swp391 database...")
        cursor.execute("GRANT ALL PRIVILEGES ON swp391.* TO 'nhatpm'@'%'")
        
        # Make sure privileges are applied
        cursor.execute("FLUSH PRIVILEGES")
        
        # Verify the user was created
        cursor.execute("SELECT user, host FROM mysql.user WHERE user = 'nhatpm'")
        users = cursor.fetchall()
        
        if users:
            print("\n✅ nhatpm user created successfully!")
            print("User details:")
            for user in users:
                print(f"  - {user[0]}@{user[1]}")
            
            print("\n✅ Database setup complete!")
        else:
            print("❌ Failed to create nhatpm user")
            
        # Close connection
        cursor.close()
        conn.close()
        
        print("\nNow update your .env file or app.py with these credentials:")
        print("DB_HOST=localhost")
        print("DB_USER=nhatpm")
        print("DB_PASSWORD=#Nhatfw3124")
        print("DB_NAME=swp391")
        
    except mysql.connector.Error as err:
        print(f"❌ MySQL Error: {err}")
        print("\nPossible solutions:")
        print("1. Make sure MySQL is running")
        print("2. Check that root password is correct")
        print("3. Ensure you have admin privileges on MySQL")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_nhatpm_user() 