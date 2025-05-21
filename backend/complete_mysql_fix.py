import subprocess
import sys
import os
import platform

def print_header(text):
    print("\n" + "=" * 50)
    print(text)
    print("=" * 50)

print_header("HƯỚNG DẪN KHẮC PHỤC LỖI KẾT NỐI MYSQL TOÀN DIỆN")
print("Chương trình này sẽ hướng dẫn chi tiết các bước khắc phục lỗi kết nối MySQL")

# Kiểm tra MySQL đã cài đặt chưa
print_header("1. KIỂM TRA CÀI ĐẶT MYSQL")
mysql_installed = False

try:
    mysql_version = subprocess.run("mysql --version", shell=True, capture_output=True, text=True)
    if mysql_version.returncode == 0:
        print(f"✅ MySQL đã được cài đặt: {mysql_version.stdout.strip()}")
        mysql_installed = True
    else:
        print("❌ Không tìm thấy MySQL, có thể chưa cài đặt hoặc chưa thêm vào PATH")
except:
    print("❌ Không thể kiểm tra phiên bản MySQL")

# Kiểm tra dịch vụ MySQL
print_header("2. KIỂM TRA DỊCH VỤ MYSQL")
mysql_running = False

if platform.system() == "Windows":
    try:
        service_check = subprocess.run("sc query mysql", shell=True, capture_output=True, text=True)
        if "RUNNING" in service_check.stdout:
            print("✅ Dịch vụ MySQL đang chạy")
            mysql_running = True
        else:
            print("❌ Dịch vụ MySQL không chạy hoặc không tìm thấy")
            print("   → Thử kiểm tra dịch vụ 'MySQL80' hoặc 'MySQL' trong services.msc")
    except:
        print("❌ Không thể kiểm tra trạng thái dịch vụ MySQL")
        
    # Kiểm tra XAMPP
    try:
        xampp_check = subprocess.run("sc query mysql", shell=True, capture_output=True, text=True)
        if os.path.exists("C:\\xampp\\mysql"):
            print("✅ Tìm thấy XAMPP MySQL")
            print("   → Hãy đảm bảo đã khởi động MySQL từ XAMPP Control Panel")
    except:
        pass

# Kiểm tra cổng 3306
print_header("3. KIỂM TRA CỔNG KẾT NỐI")
port_open = False

try:
    netstat = subprocess.run("netstat -an | findstr 3306", shell=True, capture_output=True, text=True)
    if "LISTENING" in netstat.stdout and "3306" in netstat.stdout:
        print("✅ Cổng 3306 đang mở và lắng nghe")
        port_open = True
    else:
        print("❌ Cổng 3306 không mở hoặc không có ứng dụng nào đang lắng nghe")
except:
    print("❌ Không thể kiểm tra trạng thái cổng 3306")

# Kiểm tra kết nối cơ bản
print_header("4. KIỂM TRA KẾT NỐI CƠ BẢN")

if mysql_installed:
    try:
        check_connection = subprocess.run("mysql -u root -p#Nhatfw3124 -e \"SELECT 'Kết nối thành công!'\"", 
                          shell=True, capture_output=True, text=True)
        if "Kết nối thành công" in check_connection.stdout:
            print("✅ Kết nối với MySQL thành công")
        else:
            print("❌ Không kết nối được với MySQL")
            if "Access denied" in check_connection.stderr:
                print("   → Lỗi xác thực: Mật khẩu không đúng hoặc tài khoản không có quyền")
            elif "Can't connect" in check_connection.stderr:
                print("   → Không thể kết nối: MySQL có thể chưa chạy")
    except:
        print("❌ Không thể kiểm tra kết nối MySQL")

# Đề xuất giải pháp
print_header("HƯỚNG DẪN KHẮC PHỤC LỖI")

print("""
A. CÁCH 1: CÀI ĐẶT MYSQL HOÀN CHỈNH
---------------------------------------
1. Tải MySQL Installer từ: https://dev.mysql.com/downloads/installer/
2. Cài đặt MySQL Server, nhớ lưu mật khẩu root khi được hỏi
3. Mở Command Prompt và tạo cơ sở dữ liệu:

   mysql -u root -p
   [nhập mật khẩu]

   CREATE DATABASE swp391;
   CREATE USER 'remote_user'@'%' IDENTIFIED BY '#Nhatfw3124';
   GRANT ALL PRIVILEGES ON swp391.* TO 'remote_user'@'%';
   FLUSH PRIVILEGES;
   EXIT;

4. Mở cổng tường lửa (chạy Command Prompt với quyền Admin):
   
   netsh advfirewall firewall add rule name="MySQL" dir=in action=allow protocol=TCP localport=3306

5. Khởi động lại dịch vụ MySQL (trong services.msc)

6. Sửa file app.py để sử dụng tài khoản đã tạo:

   db_config = {
       'host': '127.0.0.1',
       'user': 'remote_user',
       'password': '#Nhatfw3124',
       'database': 'swp391'
   }

B. CÁCH 2: SỬ DỤNG XAMPP (DỄ HƠN)
-----------------------------------
1. Tải XAMPP từ: https://www.apachefriends.org/download.html
2. Cài đặt XAMPP và khởi động MySQL từ Control Panel
3. Mở phpMyAdmin (từ Control Panel) để tạo database:
   - Tạo database mới tên "swp391"
4. Mở file app.py và thay đổi thành:

   db_config = {
       'host': '127.0.0.1',
       'user': 'root',
       'password': '',  # XAMPP mặc định không có mật khẩu
       'database': 'swp391'
   }

C. CÁCH 3: CHUYỂN SANG SQLITE (ĐƠN GIẢN NHẤT)
----------------------------------------------
1. Sửa lại code để dùng SQLite thay vì MySQL (cần code lại app.py)
2. SQLite không cần cài đặt server, dễ sử dụng hơn nhiều

D. KIỂM TRA LẠI CƠ BẢN
-----------------------
1. Kiểm tra dịch vụ MySQL đang chạy: services.msc
2. Kiểm tra tường lửa: Windows Defender Firewall
3. Thử tắt tạm thời Windows Defender và Antivirus
4. Thử restart máy tính
5. Kiểm tra kết nối bằng công cụ khác: MySQL Workbench

E. TÀI LIỆU THAM KHẢO
---------------------
- Hướng dẫn cài đặt MySQL: https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/
- Hướng dẫn XAMPP: https://www.apachefriends.org/faq_windows.html
- Hướng dẫn Python MySQL: https://www.w3schools.com/python/python_mysql_getstarted.asp
""")

if not mysql_installed:
    print("\n⚠️ Bạn cần CÀI ĐẶT MySQL trước tiên - Xem hướng dẫn ở mục A hoặc B")
elif not mysql_running:
    print("\n⚠️ MySQL đã cài đặt nhưng CHƯA CHẠY - Kiểm tra services.msc hoặc XAMPP Control Panel")
elif not port_open:
    print("\n⚠️ MySQL đã chạy nhưng CỔNG 3306 CHƯA MỞ - Kiểm tra tường lửa hoặc cấu hình MySQL")
else:
    print("\n⚠️ MySQL dường như đã chạy, nhưng kết nối vẫn bị lỗi - Kiểm tra thông tin đăng nhập và cấu hình database") 