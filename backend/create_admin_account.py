import mysql.connector
from dotenv import load_dotenv
import os
from argon2 import PasswordHasher
import logging
import getpass
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger('admin-creator')

# Load environment variables
load_dotenv()

def create_admin(username=None, password=None):
    """
    Create a new admin account or update an existing one
    
    Args:
        username (str, optional): Admin username. If not provided, will be prompted.
        password (str, optional): Admin password. If not provided, will be prompted.
    """
    # Database configuration
    db_config = {
        'host': os.getenv('DB_HOST', '127.0.0.1'),
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD'),
        'database': os.getenv('DB_NAME', 'swp391')
    }
    
    # Check for required environment variables
    if not db_config['password']:
        logger.error("DB_PASSWORD environment variable is not set")
        sys.exit(1)
    
    # Get username and password if not provided
    if not username:
        username = input("Enter admin username (default: admin): ").strip() or "admin"
    
    if not password:
        password = getpass.getpass("Enter admin password (min 8 characters): ")
        if len(password) < 8:
            logger.error("Password must be at least 8 characters long")
            sys.exit(1)
    
    # Hash password with Argon2
    ph = PasswordHasher()
    hashed_password = ph.hash(password)
    
    try:
        # Connect to database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Create admins table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'super_admin') NOT NULL DEFAULT 'admin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP NULL DEFAULT NULL
        );
        ''')
        conn.commit()
        
        # Check if admin already exists
        cursor.execute("SELECT * FROM admins WHERE username = %s", (username,))
        existing_admin = cursor.fetchone()
        
        if existing_admin:
            logger.info(f"Admin '{username}' already exists. Updating password...")
            cursor.execute("UPDATE admins SET password = %s WHERE username = %s", (hashed_password, username))
        else:
            logger.info(f"Creating new admin '{username}'...")
            cursor.execute(
                "INSERT INTO admins (username, password, role) VALUES (%s, %s, %s)",
                (username, hashed_password, 'admin')
            )
        
        conn.commit()
        logger.info(f"Admin account successfully created/updated.")
        logger.info(f"Username: {username}")
        
        cursor.close()
        conn.close()
        return True
        
    except mysql.connector.Error as e:
        logger.error(f"Database error creating admin account: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error creating admin account: {str(e)}")
        return False

if __name__ == "__main__":
    create_admin() 