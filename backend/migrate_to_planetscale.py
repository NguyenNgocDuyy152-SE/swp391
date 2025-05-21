import mysql.connector
import os
from dotenv import load_dotenv
import sys
import time

# Tải biến môi trường từ file .env
load_dotenv()

# Cấu hình kết nối local
local_config = {
    'host': 'localhost',
    'user': 'nhatpm',
    'password': '#Nhatfw3124',
    'database': 'swp391'
}

# Cấu hình kết nối PlanetScale
# Lưu ý: Bạn cần điền các thông tin này từ PlanetScale
planetscale_config = {
    'host': input("Nhập PlanetScale host: "),
    'user': input("Nhập PlanetScale username: "),
    'password': input("Nhập PlanetScale password: "),
    'database': 'swp391',
    'ssl_ca': '/etc/ssl/cert.pem',  # Path mặc định trên hầu hết các hệ thống
    'ssl_verify_cert': True
}

def get_local_connection():
    try:
        return mysql.connector.connect(**local_config)
    except mysql.connector.Error as err:
        print(f"❌ Lỗi kết nối đến database local: {err}")
        return None

def get_planetscale_connection():
    try:
        return mysql.connector.connect(**planetscale_config)
    except mysql.connector.Error as err:
        print(f"❌ Lỗi kết nối đến PlanetScale: {err}")
        return None

def get_tables(connection):
    cursor = connection.cursor()
    cursor.execute("SHOW TABLES")
    tables = [table[0] for table in cursor.fetchall()]
    cursor.close()
    return tables

def get_table_structure(connection, table_name):
    cursor = connection.cursor()
    cursor.execute(f"SHOW CREATE TABLE {table_name}")
    create_statement = cursor.fetchone()[1]
    cursor.close()
    return create_statement

def get_table_data(connection, table_name):
    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM {table_name}")
    data = cursor.fetchall()
    
    # Lấy thông tin các cột
    cursor.execute(f"SHOW COLUMNS FROM {table_name}")
    columns = [column[0] for column in cursor.fetchall()]
    
    cursor.close()
    return data, columns

def create_table(connection, create_statement):
    cursor = connection.cursor()
    try:
        cursor.execute(create_statement)
        connection.commit()
        return True
    except mysql.connector.Error as err:
        print(f"❌ Lỗi khi tạo bảng: {err}")
        return False
    finally:
        cursor.close()

def insert_data(connection, table_name, data, columns):
    if not data:
        print(f"Không có dữ liệu để chèn vào bảng {table_name}")
        return True
    
    cursor = connection.cursor()
    placeholders = ', '.join(['%s'] * len(columns))
    column_names = ', '.join(columns)
    
    insert_query = f"INSERT INTO {table_name} ({column_names}) VALUES ({placeholders})"
    
    try:
        cursor.executemany(insert_query, data)
        connection.commit()
        return True
    except mysql.connector.Error as err:
        print(f"❌ Lỗi khi chèn dữ liệu vào {table_name}: {err}")
        connection.rollback()
        return False
    finally:
        cursor.close()

def migrate_database():
    print("🚀 Bắt đầu migrate dữ liệu từ local đến PlanetScale...")
    
    # Kết nối đến cả hai database
    local_conn = get_local_connection()
    if not local_conn:
        return
    
    planetscale_conn = get_planetscale_connection()
    if not planetscale_conn:
        local_conn.close()
        return
    
    # Lấy danh sách bảng từ database local
    tables = get_tables(local_conn)
    print(f"📋 Các bảng cần migrate: {', '.join(tables)}")
    
    for table in tables:
        print(f"\n⏳ Đang migrate bảng: {table}")
        # Lấy cấu trúc bảng
        create_statement = get_table_structure(local_conn, table)
        
        # Tạo bảng trên PlanetScale
        print(f"  - Tạo bảng {table} trên PlanetScale...")
        
        # Sửa CREATE TABLE statement để phù hợp với PlanetScale
        # PlanetScale không hỗ trợ foreign key constraints
        create_statement = create_statement.replace("ENGINE=InnoDB", "ENGINE=InnoDB")
        
        # Xóa foreign key constraints
        import re
        create_statement = re.sub(r',\s*CONSTRAINT.*FOREIGN KEY.*REFERENCES.*\)', ')', create_statement)
        
        if create_table(planetscale_conn, create_statement):
            # Lấy dữ liệu từ local
            data, columns = get_table_data(local_conn, table)
            
            # Chèn dữ liệu vào PlanetScale
            print(f"  - Chèn {len(data)} bản ghi vào bảng {table}...")
            if insert_data(planetscale_conn, table, data, columns):
                print(f"✅ Migrate bảng {table} thành công!")
            else:
                print(f"❌ Migrate dữ liệu bảng {table} thất bại!")
        else:
            print(f"❌ Tạo bảng {table} trên PlanetScale thất bại!")
    
    # Đóng kết nối
    local_conn.close()
    planetscale_conn.close()
    
    print("\n✅ Hoàn thành quá trình migrate!")
    print("\n🔧 Cập nhật biến môi trường trong Render với các thông tin sau:")
    print(f"DB_HOST={planetscale_config['host']}")
    print(f"DB_USER={planetscale_config['user']}")
    print(f"DB_PASSWORD=********") # Không hiện mật khẩu
    print("DB_NAME=swp391")
    print("DB_SSL_MODE=REQUIRED")

if __name__ == "__main__":
    migrate_database() 