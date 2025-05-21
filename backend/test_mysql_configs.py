import mysql.connector
import time

def test_mysql_connection(config, name):
    print(f"\nThử kết nối {name}...")
    try:
        start_time = time.time()
        conn = mysql.connector.connect(**config, connection_timeout=5)
        end_time = time.time()
        
        print(f"✅ Kết nối thành công! (thời gian: {end_time-start_time:.2f}s)")
        
        # Thử truy vấn cơ bản
        cursor = conn.cursor()
        cursor.execute("SELECT @@version")
        version = cursor.fetchone()
        print(f"   MySQL version: {version[0]}")
        cursor.close()
        conn.close()
        
        return True
    except Exception as e:
        print(f"❌ Kết nối thất bại: {str(e)}")
        return False

print("===== Kiểm tra các cấu hình MySQL khác nhau =====")

configs = [
    {
        "name": "Localhost + root",
        "config": {
            "host": "localhost",
            "user": "root",
            "password": "#Nhatfw3124",
            "database": "swp391"
        }
    },
    {
        "name": "IP (127.0.0.1) + root",
        "config": {
            "host": "127.0.0.1",
            "user": "root",
            "password": "#Nhatfw3124",
            "database": "swp391"
        }
    },
    {
        "name": "Localhost + remote_user",
        "config": {
            "host": "localhost",
            "user": "remote_user",
            "password": "#Nhatfw3124",
            "database": "swp391"
        }
    },
    {
        "name": "IP (127.0.0.1) + remote_user",
        "config": {
            "host": "127.0.0.1",
            "user": "remote_user",
            "password": "#Nhatfw3124",
            "database": "swp391"
        }
    },
    {
        "name": "Localhost không có database",
        "config": {
            "host": "localhost",
            "user": "root",
            "password": "#Nhatfw3124"
        }
    },
    {
        "name": "IP (127.0.0.1) không có database",
        "config": {
            "host": "127.0.0.1",
            "user": "root",
            "password": "#Nhatfw3124"
        }
    }
]

success = False
for test in configs:
    if test_mysql_connection(test["config"], test["name"]):
        success = True

if not success:
    print("\n❌ Tất cả các cấu hình đều thất bại! Kiểm tra lại:")
    print("1. MySQL có đang chạy không?")
    print("2. Mật khẩu có đúng không?")
    print("3. Có rule tường lửa cho port 3306 chưa?")
    print("4. Database 'swp391' đã được tạo chưa?")
else:
    print("\n✅ Đã tìm thấy ít nhất một cấu hình hoạt động!")
    print("→ Sử dụng thông tin đăng nhập hoạt động trong file .env") 