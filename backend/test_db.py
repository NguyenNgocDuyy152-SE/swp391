import mysql.connector

# Database configuration
db_config = {
    'host': '42.119.81.206',  # Địa chỉ IP của máy bạn bạn
    'user': 'root',
    'password': '#Nhatfw3124',
    'database': 'swp391'
}

try:
    print("Đang kết nối đến MySQL từ xa...")
    conn = mysql.connector.connect(**db_config)
    print("Kết nối thành công!")
    
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    
    print("Các bảng trong cơ sở dữ liệu:")
    for table in tables:
        print(f"- {table[0]}")
    
    cursor.close()
    conn.close()
    
except mysql.connector.Error as err:
    print(f"Lỗi: {err}")
    print("\nCác bước khắc phục cho kết nối từ xa:")
    print("1. Đảm bảo địa chỉ IP '42.119.81.206' là chính xác")
    print("2. Kiểm tra xem MySQL trên máy từ xa có đang chạy không")
    print("3. Đảm bảo cổng 3306 không bị chặn bởi tường lửa")
    print("4. Kiểm tra xem user 'root' có quyền kết nối từ xa không") 