#!/usr/bin/env python
from argon2 import PasswordHasher, Type
from db_utils import DatabaseManager
import getpass
import os
from dotenv import load_dotenv

# Tải biến môi trường
load_dotenv()

def create_admin_table():
    """Tạo bảng admin nếu chưa tồn tại"""
    db = DatabaseManager()
    db.create_table("admins", """
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        status ENUM('active', 'inactive') DEFAULT 'active'
    """)
    print("Đã tạo bảng admins")
    return db

def create_root_admin():
    """Tạo tài khoản admin root với mật khẩu bảo mật"""
    db = create_admin_table()
    
    # Kiểm tra xem đã có admin root chưa
    admin = db.fetch_one("SELECT * FROM admins WHERE username = 'root_admin'")
    if admin:
        print(f"Admin root đã tồn tại (username: {admin['username']})")
        update = input("Bạn có muốn cập nhật mật khẩu không? (y/n): ")
        if update.lower() != 'y':
            return
    
    # Nhập thông tin admin
    username = input("Nhập tên đăng nhập (mặc định: root_admin): ") or "root_admin"
    name = input("Nhập tên hiển thị (mặc định: Root Administrator): ") or "Root Administrator"
    email = input("Nhập email (mặc định: admin@example.com): ") or "admin@example.com"
    
    # Sử dụng getpass để nhập mật khẩu an toàn (không hiển thị khi gõ)
    while True:
        password = getpass.getpass("Nhập mật khẩu (tối thiểu 12 ký tự): ")
        if len(password) < 12:
            print("Mật khẩu quá ngắn! Vui lòng nhập ít nhất 12 ký tự")
            continue
            
        confirm = getpass.getpass("Xác nhận mật khẩu: ")
        if password != confirm:
            print("Mật khẩu không khớp! Vui lòng thử lại")
            continue
        break
    
    # Mã hóa mật khẩu với Argon2id
    ph = PasswordHasher(time_cost=2, memory_cost=102400, parallelism=8, type=Type.ID)
    hashed_password = ph.hash(password)
    
    # Thêm hoặc cập nhật admin
    if admin:
        # Cập nhật mật khẩu cho admin hiện tại
        db.execute_query(
            "UPDATE admins SET password = %s WHERE id = %s", 
            (hashed_password, admin['id'])
        )
        print(f"Đã cập nhật mật khẩu cho admin {username}")
    else:
        # Tạo admin mới
        admin_data = {
            "username": username,
            "password": hashed_password,
            "name": name,
            "email": email,
            "status": "active"
        }
        admin_id = db.insert_data("admins", admin_data)
        print(f"Đã tạo tài khoản admin với ID: {admin_id}")

if __name__ == "__main__":
    create_root_admin() 