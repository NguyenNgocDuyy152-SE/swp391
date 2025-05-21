import mysql.connector
import sys

def create_remote_user():
    try:
        # Connect to MySQL as root
        print("Connecting to MySQL as root...")
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="#Nhatfw3124"
        )
        
        cursor = conn.cursor()
        
        # Create remote_user if it doesn't exist
        print("Creating remote_user with access from any host...")
        cursor.execute("CREATE USER IF NOT EXISTS 'remote_user'@'%' IDENTIFIED BY '#Nhatfw3124'")
        
        # Grant all privileges on the swp391 database
        print("Granting privileges on swp391 database...")
        cursor.execute("GRANT ALL PRIVILEGES ON swp391.* TO 'remote_user'@'%'")
        
        # Make sure privileges are applied
        cursor.execute("FLUSH PRIVILEGES")
        
        # Verify the user was created
        cursor.execute("SELECT user, host FROM mysql.user WHERE user = 'remote_user'")
        users = cursor.fetchall()
        
        if users:
            print("\n✅ remote_user created successfully!")
            print("User details:")
            for user in users:
                print(f"  - {user[0]}@{user[1]}")
        else:
            print("❌ Failed to create remote_user")
            
        # Close connection
        cursor.close()
        conn.close()
        
        print("\nNow update your .env or app.py to use:")
        print("DB_USER=remote_user")
        print("DB_PASSWORD=#Nhatfw3124")
        
    except mysql.connector.Error as err:
        print(f"❌ MySQL Error: {err}")
        print("\nPossible solutions:")
        print("1. Make sure MySQL is running")
        print("2. Check that root password is correct")
        print("3. Ensure you have admin privileges on MySQL")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_remote_user() 