import subprocess
import platform
import os

def check_windows_firewall():
    print("===== Kiểm tra Tường lửa cho MySQL (Port 3306) =====")
    
    # Kiểm tra quy tắc tường lửa hiện có
    print("\n1. Kiểm tra quy tắc tường lửa cho MySQL...")
    try:
        result = subprocess.run(
            ['netsh', 'advfirewall', 'firewall', 'show', 'rule', 'name=all', '|', 'findstr', 'MySQL'],
            capture_output=True, 
            text=True,
            shell=True
        )
        
        if "MySQL" in result.stdout:
            print("✅ Đã tìm thấy quy tắc tường lửa cho MySQL:")
            print(result.stdout)
        else:
            print("❌ Không tìm thấy quy tắc tường lửa cho MySQL")
            print("   → MySQL có thể bị chặn")
    except Exception as e:
        print(f"❌ Lỗi khi kiểm tra tường lửa: {str(e)}")
    
    # Kiểm tra cổng 3306 có đang mở không
    print("\n2. Kiểm tra cổng 3306 có đang mở không...")
    try:
        result = subprocess.run(
            ['netstat', '-an', '|', 'findstr', '3306'],
            capture_output=True, 
            text=True,
            shell=True
        )
        
        if "3306" in result.stdout and "LISTENING" in result.stdout:
            print("✅ Cổng 3306 đang LISTENING:")
            print(result.stdout)
        else:
            print("❌ Cổng 3306 không trong trạng thái LISTENING")
            print("   → MySQL Server có thể chưa khởi động")
    except Exception as e:
        print(f"❌ Lỗi khi kiểm tra cổng: {str(e)}")
    
    # Tạo quy tắc tường lửa cho MySQL
    print("\n===== Tạo quy tắc tường lửa cho MySQL =====")
    print("""
Để mở cổng 3306 trên tường lửa Windows, chạy Command Prompt với quyền Admin và nhập:

netsh advfirewall firewall add rule name="MySQL" dir=in action=allow protocol=TCP localport=3306

Để tắm tạm thời tường lửa Windows (chỉ nên làm khi test):

netsh advfirewall set currentprofile state off
    """)

if __name__ == "__main__":
    if platform.system() == "Windows":
        check_windows_firewall()
    else:
        print("Script này chỉ hoạt động trên Windows. Bạn đang sử dụng " + platform.system()) 