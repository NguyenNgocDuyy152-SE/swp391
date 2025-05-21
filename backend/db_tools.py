import mysql.connector
from mysql.connector import Error
import os
from config import DB_CONFIG
import getpass

class DatabaseTools:
    def __init__(self):
        self.host = DB_CONFIG['host']
        self.user = DB_CONFIG['user']
        self.password = DB_CONFIG['password']
        self.database = DB_CONFIG['database']

    def clear_screen(self):
        os.system('cls' if os.name == 'nt' else 'clear')

    def connect_root(self):
        """Kết nối với quyền root"""
        try:
            print("\nKết nối MySQL với quyền root")
            print("----------------------------")
            root_password = getpass.getpass("Nhập mật khẩu root MySQL: ")
            
            # Thử kết nối trực tiếp qua TCP
            try:
                print("\nĐang kết nối tới MySQL...")
                connection = mysql.connector.connect(
                    host='127.0.0.1',
                    user='root',
                    password=root_password,
                    auth_plugin='mysql_native_password'  # Chỉ định phương thức xác thực
                )
                print("Kết nối thành công!")
                return connection
            except Error as e:
                if "Access denied" in str(e):
                    print("\nLỗi xác thực. Đang thử phương thức khác...")
                    try:
                        # Thử kết nối không có auth_plugin
                        connection = mysql.connector.connect(
                            host='127.0.0.1',
                            user='root',
                            password=root_password
                        )
                        print("Kết nối thành công!")
                        return connection
                    except Error as e2:
                        print(f"Không thể kết nối: {e2}")
                        raise
                else:
                    raise
                    
        except Error as e:
            print(f"\nLỗi khi kết nối với MySQL: {e}")
            print("\nGợi ý khắc phục:")
            print("1. Kiểm tra lại mật khẩu root")
            print("2. Đảm bảo MySQL đang chạy")
            print("3. Thử đăng nhập trực tiếp để xác nhận mật khẩu:")
            print("   mysql -u root -p")
            print("\n4. Nếu quên mật khẩu root, có thể reset bằng cách:")
            print("   a. Dừng MySQL server")
            print("   b. Khởi động MySQL với --skip-grant-tables")
            print("   c. Kết nối và đặt lại mật khẩu root")
            return None

    def connect_database(self):
        """Kết nối với database hiện tại"""
        try:
            connection = mysql.connector.connect(**DB_CONFIG)
            return connection
        except Error as e:
            print(f"Lỗi khi kết nối với database: {e}")
            return None

    def create_database(self):
        """Tạo database mới"""
        connection = self.connect_root()
        if connection:
            try:
                cursor = connection.cursor()
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS {self.database}")
                print(f"Database '{self.database}' đã được tạo thành công!")
            except Error as e:
                print(f"Lỗi khi tạo database: {e}")
            finally:
                if connection.is_connected():
                    cursor.close()
                    connection.close()

    def drop_database(self):
        """Xóa database"""
        connection = self.connect_root()
        if connection:
            try:
                if input(f"Bạn có chắc chắn muốn xóa database '{self.database}'? (y/n): ").lower() == 'y':
                    cursor = connection.cursor()
                    cursor.execute(f"DROP DATABASE IF EXISTS {self.database}")
                    print(f"Database '{self.database}' đã được xóa thành công!")
                else:
                    print("Hủy xóa database.")
            except Error as e:
                print(f"Lỗi khi xóa database: {e}")
            finally:
                if connection.is_connected():
                    cursor.close()
                    connection.close()

    def create_root_user(self):
        """Tạo tài khoản root mới"""
        connection = self.connect_root()
        if connection:
            try:
                new_root_user = input("Nhập tên người dùng root mới: ")
                new_root_password = getpass.getpass("Nhập mật khẩu cho người dùng root mới: ")
                
                cursor = connection.cursor()
                
                # Kiểm tra xem user đã tồn tại chưa
                cursor.execute(f"SELECT User FROM mysql.user WHERE User = '{new_root_user}' AND Host = 'localhost'")
                if cursor.fetchone():
                    # Nếu user đã tồn tại, hỏi người dùng có muốn cập nhật không
                    if input(f"User '{new_root_user}' đã tồn tại. Bạn có muốn cập nhật mật khẩu và quyền không? (y/n): ").lower() == 'y':
                        # Xóa user cũ
                        cursor.execute(f"DROP USER IF EXISTS '{new_root_user}'@'localhost'")
                    else:
                        print("Hủy tạo tài khoản.")
                        return
                
                # Tạo user mới với quyền root
                print(f"Đang tạo user '{new_root_user}'...")
                cursor.execute(f"CREATE USER '{new_root_user}'@'localhost' IDENTIFIED BY '{new_root_password}'")
                
                print("Đang cấp quyền root...")
                cursor.execute(f"GRANT ALL PRIVILEGES ON *.* TO '{new_root_user}'@'localhost' WITH GRANT OPTION")
                cursor.execute("FLUSH PRIVILEGES")
                
                print(f"Tài khoản root '{new_root_user}' đã được tạo thành công!")
                print(f"Bạn có thể đăng nhập bằng:")
                print(f"Username: {new_root_user}")
                print("Password: [Mật khẩu bạn vừa nhập]")
                
            except Error as e:
                print(f"Lỗi khi tạo tài khoản root: {e}")
                if "Operation CREATE USER failed" in str(e):
                    print("\nGợi ý khắc phục:")
                    print("1. Đảm bảo bạn đang sử dụng tài khoản root có đầy đủ quyền")
                    print("2. Thử sử dụng một tên người dùng khác")
                    print("3. Kiểm tra xem user đã tồn tại chưa trong MySQL")
            finally:
                if connection.is_connected():
                    cursor.close()
                    connection.close()

    def show_tables(self):
        """Hiển thị danh sách các bảng trong database"""
        connection = self.connect_database()
        if connection:
            try:
                cursor = connection.cursor()
                cursor.execute("SHOW TABLES")
                tables = cursor.fetchall()
                
                if tables:
                    print("\nDanh sách các bảng trong database:")
                    for table in tables:
                        print(f"- {table[0]}")
                else:
                    print("Không có bảng nào trong database.")
            except Error as e:
                print(f"Lỗi khi lấy danh sách bảng: {e}")
            finally:
                if connection.is_connected():
                    cursor.close()
                    connection.close()

    def truncate_table(self):
        """Xóa toàn bộ dữ liệu trong bảng"""
        self.show_tables()
        table_name = input("\nNhập tên bảng muốn xóa dữ liệu: ")
        
        connection = self.connect_database()
        if connection:
            try:
                if input(f"Bạn có chắc chắn muốn xóa toàn bộ dữ liệu trong bảng '{table_name}'? (y/n): ").lower() == 'y':
                    cursor = connection.cursor()
                    cursor.execute(f"TRUNCATE TABLE {table_name}")
                    print(f"Đã xóa toàn bộ dữ liệu trong bảng '{table_name}'!")
                else:
                    print("Hủy xóa dữ liệu.")
            except Error as e:
                print(f"Lỗi khi xóa dữ liệu bảng: {e}")
            finally:
                if connection.is_connected():
                    cursor.close()
                    connection.close()

    def show_menu(self):
        """Hiển thị menu chính"""
        while True:
            self.clear_screen()
            print("\n=== CÔNG CỤ QUẢN LÝ DATABASE ===")
            print(f"Database hiện tại: {self.database}")
            print("\n1. Tạo database mới")
            print("2. Xóa database")
            print("3. Tạo tài khoản root mới")
            print("4. Xem danh sách bảng")
            print("5. Xóa dữ liệu trong bảng")
            print("0. Thoát")
            
            choice = input("\nChọn chức năng (0-5): ")
            
            if choice == '1':
                self.create_database()
            elif choice == '2':
                self.drop_database()
            elif choice == '3':
                self.create_root_user()
            elif choice == '4':
                self.show_tables()
            elif choice == '5':
                self.truncate_table()
            elif choice == '0':
                print("\nTạm biệt!")
                break
            else:
                print("\nLựa chọn không hợp lệ!")
            
            input("\nNhấn Enter để tiếp tục...")

if __name__ == "__main__":
    db_tools = DatabaseTools()
    db_tools.show_menu() 