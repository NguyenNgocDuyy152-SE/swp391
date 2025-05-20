import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

# Tải biến môi trường từ file .env
load_dotenv()

class DatabaseManager:
    def __init__(self):
        """Khởi tạo đối tượng DatabaseManager với thông tin kết nối từ biến môi trường"""
        self.config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'user': os.getenv('DB_USER', 'root'),
            'password': os.getenv('DB_PASSWORD', ''),
            'database': os.getenv('DB_NAME', 'swp391')
        }
        self.connection = None

    def connect(self):
        """Tạo kết nối đến MySQL database"""
        try:
            if self.connection is None or not self.connection.is_connected():
                self.connection = mysql.connector.connect(**self.config)
                print("Kết nối MySQL database thành công!")
            return self.connection
        except Error as e:
            print(f"Lỗi kết nối đến MySQL: {e}")
            return None

    def disconnect(self):
        """Đóng kết nối đến database"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("Đã đóng kết nối MySQL")

    def execute_query(self, query, params=None):
        """
        Thực thi truy vấn SQL không trả về kết quả (INSERT, UPDATE, DELETE)
        
        Args:
            query (str): Câu truy vấn SQL
            params (tuple, optional): Tham số cho câu truy vấn SQL
            
        Returns:
            bool: True nếu thành công, False nếu thất bại
        """
        try:
            connection = self.connect()
            if connection:
                cursor = connection.cursor()
                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)
                connection.commit()
                print("Thực thi truy vấn thành công")
                last_id = cursor.lastrowid  # Lấy ID của bản ghi vừa chèn (nếu là INSERT)
                cursor.close()
                return last_id if last_id else True
            return False
        except Error as e:
            print(f"Lỗi thực thi truy vấn: {e}")
            return False

    def execute_select(self, query, params=None, dictionary=True):
        """
        Thực thi truy vấn SQL trả về kết quả (SELECT)
        
        Args:
            query (str): Câu truy vấn SQL
            params (tuple, optional): Tham số cho câu truy vấn SQL
            dictionary (bool): Trả về kết quả dưới dạng dictionary nếu True
            
        Returns:
            list: Danh sách các bản ghi (dạng dictionary hoặc tuple)
        """
        try:
            connection = self.connect()
            if connection:
                cursor = connection.cursor(dictionary=dictionary)
                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)
                result = cursor.fetchall()
                cursor.close()
                return result
            return None
        except Error as e:
            print(f"Lỗi thực thi truy vấn SELECT: {e}")
            return None
            
    def fetch_one(self, query, params=None, dictionary=True):
        """Trả về một bản ghi đầu tiên từ kết quả truy vấn"""
        try:
            connection = self.connect()
            if connection:
                cursor = connection.cursor(dictionary=dictionary)
                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)
                result = cursor.fetchone()
                cursor.close()
                return result
            return None
        except Error as e:
            print(f"Lỗi thực thi truy vấn fetch_one: {e}")
            return None

    # Các hàm tiện ích

    def create_table(self, table_name, columns_definition):
        """
        Tạo bảng mới trong database
        
        Args:
            table_name (str): Tên bảng
            columns_definition (str): Định nghĩa các cột
            
        Returns:
            bool: True nếu thành công, False nếu thất bại
        """
        query = f"CREATE TABLE IF NOT EXISTS {table_name} ({columns_definition})"
        return self.execute_query(query)

    def insert_data(self, table, data):
        """
        Chèn dữ liệu vào bảng
        
        Args:
            table (str): Tên bảng
            data (dict): Dữ liệu cần chèn (dạng {"column": value})
            
        Returns:
            int/bool: ID bản ghi vừa chèn nếu thành công, False nếu thất bại
        """
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['%s'] * len(data))
        query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
        params = tuple(data.values())
        return self.execute_query(query, params)

    def update_data(self, table, data, condition):
        """
        Cập nhật dữ liệu trong bảng
        
        Args:
            table (str): Tên bảng
            data (dict): Dữ liệu cần cập nhật (dạng {"column": value})
            condition (str): Điều kiện cập nhật (vd: "id = 1")
            
        Returns:
            bool: True nếu thành công, False nếu thất bại
        """
        set_clause = ', '.join([f"{k} = %s" for k in data.keys()])
        query = f"UPDATE {table} SET {set_clause} WHERE {condition}"
        params = tuple(data.values())
        return self.execute_query(query, params)

    def delete_data(self, table, condition):
        """
        Xóa dữ liệu từ bảng
        
        Args:
            table (str): Tên bảng
            condition (str): Điều kiện xóa (vd: "id = 1")
            
        Returns:
            bool: True nếu thành công, False nếu thất bại
        """
        query = f"DELETE FROM {table} WHERE {condition}"
        return self.execute_query(query)

    def record_exists(self, table, condition):
        """
        Kiểm tra xem bản ghi có tồn tại không
        
        Args:
            table (str): Tên bảng
            condition (str): Điều kiện kiểm tra (vd: "email = 'user@example.com'")
            
        Returns:
            bool: True nếu tồn tại, False nếu không
        """
        query = f"SELECT 1 FROM {table} WHERE {condition} LIMIT 1"
        result = self.fetch_one(query)
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
    db.disconnect() 