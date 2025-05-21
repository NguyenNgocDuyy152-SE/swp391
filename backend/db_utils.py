import mysql.connector
from mysql.connector import Error, pooling
from dotenv import load_dotenv
import os
import logging
import time

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('db_utils')

class DatabaseManager:
    _instance = None
    _pool = None
    
    def __new__(cls):
        """Implement singleton pattern for DatabaseManager"""
        if cls._instance is None:
            cls._instance = super(DatabaseManager, cls).__new__(cls)
            # Move initialization to __init__
        return cls._instance
    
    def __init__(self):
        """Initialize DatabaseManager with connection info from environment variables"""
        if not hasattr(self, 'config'):  # Only initialize if not already initialized
            self.config = {
                'host': os.getenv('DB_HOST', 'localhost'),
                'user': os.getenv('DB_USER', 'root'),
                'password': os.getenv('DB_PASSWORD'),
                'database': os.getenv('DB_NAME', 'swp391'),
                'port': int(os.getenv('DB_PORT', 3306)),
                'connection_timeout': 30,
                'autocommit': True,
                'charset': 'utf8mb4',
                'use_pure': True,  # Use pure Python implementation
            }
            
            # Validate required configurations
            if not self.config['password']:
                logger.error("DB_PASSWORD environment variable is not set")
                raise ValueError("Database password not configured")
                
            # Initialize pool after config is set
            self._init_pool()

    def _init_pool(self):
        """Initialize connection pool for better performance"""
        try:
            if not hasattr(self, '_pool') or self._pool is None:  # Only initialize if not already initialized
                self._pool = pooling.MySQLConnectionPool(
                    pool_name="db_pool",
                    pool_size=5,
                    pool_reset_session=True,
                    **self.config
                )
                logger.info("Database connection pool initialized successfully")
        except Error as e:
            logger.error(f"Error initializing connection pool: {e}")
            raise

    def get_connection(self):
        """Get a connection from the pool with retry logic"""
        max_retries = 3
        retry_delay = 1  # seconds
        
        for attempt in range(max_retries):
            try:
                if self._pool:
                    connection = self._pool.get_connection()
                    if connection.is_connected():
                        return connection
            except Error as e:
                logger.warning(f"Failed to get connection (attempt {attempt+1}/{max_retries}): {e}")
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    retry_delay *= 2  # Exponential backoff
                else:
                    logger.error(f"Failed to connect to database after {max_retries} attempts")
                    raise
        
        logger.error("Could not establish database connection")
        raise ConnectionError("Failed to connect to database")

    def release_connection(self, connection):
        """Return connection to the pool"""
        if connection and connection.is_connected():
            connection.close()

    def execute_query(self, query, params=None):
        """
        Execute a non-SELECT SQL query (INSERT, UPDATE, DELETE)
        
        Args:
            query (str): SQL query string
            params (tuple|dict, optional): Parameters for the SQL query
            
        Returns:
            int|bool: Last inserted ID (for INSERT) or True if successful, False if failed
            
        Raises:
            Error: On database errors
        """
        connection = None
        try:
            connection = self.get_connection()
            cursor = connection.cursor()
            
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
                
            connection.commit()
            last_id = cursor.lastrowid
            affected_rows = cursor.rowcount
            
            cursor.close()
            logger.debug(f"Query executed successfully. Affected rows: {affected_rows}")
            return last_id if last_id else True
            
        except Error as e:
            if connection:
                connection.rollback()
            logger.error(f"Database error executing query: {e}")
            raise
        finally:
            if connection:
                self.release_connection(connection)

    def execute_select(self, query, params=None, dictionary=True):
        """
        Execute a SELECT SQL query and return results
        
        Args:
            query (str): SQL query string
            params (tuple|dict, optional): Parameters for the SQL query
            dictionary (bool): Return results as dictionaries if True, tuples if False
            
        Returns:
            list: List of records (as dictionaries or tuples)
            
        Raises:
            Error: On database errors
        """
        connection = None
        try:
            connection = self.get_connection()
            cursor = connection.cursor(dictionary=dictionary)
            
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
                
            result = cursor.fetchall()
            cursor.close()
            return result
            
        except Error as e:
            logger.error(f"Database error executing SELECT query: {e}")
            raise
        finally:
            if connection:
                self.release_connection(connection)
                
    def fetch_one(self, query, params=None, dictionary=True):
        """
        Execute a SELECT SQL query and return the first record
        
        Args:
            query (str): SQL query string
            params (tuple|dict, optional): Parameters for the SQL query
            dictionary (bool): Return result as dictionary if True, tuple if False
            
        Returns:
            dict|tuple|None: First record or None if no results
            
        Raises:
            Error: On database errors
        """
        connection = None
        try:
            connection = self.get_connection()
            cursor = connection.cursor(dictionary=dictionary)
            
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
                
            result = cursor.fetchone()
            cursor.close()
            return result
            
        except Error as e:
            logger.error(f"Database error executing fetch_one query: {e}")
            raise
        finally:
            if connection:
                self.release_connection(connection)

    # Utility methods

    def create_table(self, table_name, columns_definition):
        """
        Create a new table in the database if it doesn't exist
        
        Args:
            table_name (str): Table name
            columns_definition (str): Column definitions
            
        Returns:
            bool: True if successful
            
        Raises:
            Error: On database errors
        """
        query = f"CREATE TABLE IF NOT EXISTS {table_name} ({columns_definition})"
        return self.execute_query(query)

    def insert_data(self, table, data):
        """
        Insert data into a table
        
        Args:
            table (str): Table name
            data (dict): Data to insert as {"column": value}
            
        Returns:
            int|bool: Last inserted ID if successful
            
        Raises:
            Error: On database errors
        """
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['%s'] * len(data))
        query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
        params = tuple(data.values())
        return self.execute_query(query, params)

    def update_data(self, table, data, condition, condition_params=None):
        """
        Update data in a table
        
        Args:
            table (str): Table name
            data (dict): Data to update as {"column": value}
            condition (str): WHERE condition with %s placeholders
            condition_params (tuple): Parameters for condition
            
        Returns:
            bool: True if successful
            
        Raises:
            Error: On database errors
        """
        set_clause = ', '.join([f"{k} = %s" for k in data.keys()])
        query = f"UPDATE {table} SET {set_clause} WHERE {condition}"
        
        # Combine data values and condition parameters
        params = tuple(data.values())
        if condition_params:
            if isinstance(condition_params, tuple):
                params = params + condition_params
            else:
                params = params + (condition_params,)
                
        return self.execute_query(query, params)

    def delete_data(self, table, condition, params=None):
        """
        Delete data from a table
        
        Args:
            table (str): Table name
            condition (str): WHERE condition with %s placeholders
            params (tuple): Parameters for condition
            
        Returns:
            bool: True if successful
            
        Raises:
            Error: On database errors
        """
        query = f"DELETE FROM {table} WHERE {condition}"
        return self.execute_query(query, params)

    def record_exists(self, table, condition, params=None):
        """
        Check if a record exists
        
        Args:
            table (str): Table name
            condition (str): WHERE condition with %s placeholders
            params (tuple): Parameters for condition
            
        Returns:
            bool: True if record exists
            
        Raises:
            Error: On database errors
        """
        query = f"SELECT 1 FROM {table} WHERE {condition} LIMIT 1"
        result = self.fetch_one(query, params)
        return result is not None

    def backup_database(self, backup_path):
        """
        Tạo backup database (lưu ý: phương thức này sử dụng lệnh hệ thống, cần quyền root)
        
        Args:
            backup_path (str): Đường dẫn tới file backup
            
        Returns:
            bool: True nếu thành công, False nếu thất bại
        """
        import subprocess
        try:
            command = f"mysqldump -h {self.config['host']} -u {self.config['user']} -p{self.config['password']} {self.config['database']} > {backup_path}"
            subprocess.run(command, shell=True, check=True)
            print(f"Backup thành công tới {backup_path}")
            return True
        except subprocess.CalledProcessError as e:
            print(f"Lỗi khi backup database: {e}")
            return False

    def restore_database(self, backup_path):
        """
        Khôi phục database từ file backup (lưu ý: phương thức này sử dụng lệnh hệ thống, cần quyền root)
        
        Args:
            backup_path (str): Đường dẫn tới file backup
            
        Returns:
            bool: True nếu thành công, False nếu thất bại
        """
        import subprocess
        try:
            command = f"mysql -h {self.config['host']} -u {self.config['user']} -p{self.config['password']} {self.config['database']} < {backup_path}"
            subprocess.run(command, shell=True, check=True)
            print(f"Khôi phục thành công từ {backup_path}")
            return True
        except subprocess.CalledProcessError as e:
            print(f"Lỗi khi khôi phục database: {e}")
            return False

# Ví dụ cách sử dụng:
if __name__ == "__main__":
    # Khởi tạo đối tượng DatabaseManager
    db = DatabaseManager()
    
    # Tạo bảng users nếu chưa tồn tại
    db.create_table("users", """
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    """)
    
    # Thêm người dùng mới
    user_data = {
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "password": "hashed_password_here"
    }
    user_id = db.insert_data("users", user_data)
    
    # Truy vấn người dùng
    users = db.execute_select("SELECT * FROM users")
    print("Danh sách người dùng:", users)
    
    # Đóng kết nối
    db.release_connection(db.get_connection()) 