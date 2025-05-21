from flask import request, jsonify
from functools import wraps
from werkzeug.security import check_password_hash
import jwt
import datetime
import os
from db_utils import DatabaseManager
from dotenv import load_dotenv

# Tải biến môi trường
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-123')
TOKEN_EXPIRE_HOURS = 24  # Token hết hạn sau 24 giờ

def verify_password(stored_hash, provided_password):
    return check_password_hash(stored_hash, provided_password)

def generate_token(user_id, username, role):
    """Tạo JWT token cho admin"""
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=TOKEN_EXPIRE_HOURS),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id,
        'username': username,
        'role': role  # Thêm role vào payload
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def login_admin(username, password):
    """Đăng nhập admin và trả về token nếu thành công"""
    if not username or not password:
        return {"success": False, "message": "Vui lòng nhập đầy đủ thông tin"}
        
    try:
        db = DatabaseManager()
        admin = db.fetch_one("SELECT * FROM admins WHERE username = %s", (username,))
        
        if not admin:
            return {"success": False, "message": "Tài khoản không tồn tại"}
        
        if not verify_password(admin['password'], password):
            return {"success": False, "message": "Mật khẩu không đúng"}
        
        if admin['status'] == 'inactive':
            return {"success": False, "message": "Tài khoản đã bị vô hiệu hóa"}
        
        # Cập nhật thời gian đăng nhập cuối
        db.execute_query(
            "UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = %s",
            (admin['id'],)
        )
        
        token = generate_token(admin['id'], admin['username'], admin.get('role', 'admin'))
        
        return {
            "success": True,
            "message": "Đăng nhập thành công",
            "token": token,
            "admin": {
                "id": admin['id'],
                "username": admin['username'],
                "name": admin['name'],
                "email": admin['email'],
                "role": admin.get('role', 'admin')  # Thêm role vào response
            }
        }
    except Exception as e:
        print(f"Login error: {str(e)}")
        return {"success": False, "message": f"Lỗi đăng nhập: {str(e)}"}

def admin_required(f):
    """Decorator để bảo vệ các route yêu cầu quyền admin"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Lấy token từ header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
        if not token:
            return jsonify({"message": "Không có token xác thực"}), 401
            
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            admin_id = payload['sub']
            
            # Kiểm tra admin có tồn tại trong database
            db = DatabaseManager()
            admin = db.fetch_one("SELECT * FROM admins WHERE id = %s AND status = 'active'", (admin_id,))
            
            if not admin:
                return jsonify({"message": "Token không hợp lệ hoặc tài khoản đã bị vô hiệu hóa"}), 401
                
            # Thêm thông tin admin vào request
            request.admin = {
                "id": admin_id,
                "username": admin['username'],
                "name": admin['name'],
                "email": admin['email']
            }
            return f(*args, **kwargs)
            
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token đã hết hạn"}), 401
        except Exception as e:
            return jsonify({"message": f"Lỗi xác thực: {str(e)}"}), 401
        
    return decorated

def super_admin_required(f):
    """Decorator để bảo vệ các route yêu cầu quyền super admin"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Lấy token từ header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
        if not token:
            return jsonify({"message": "Không có token xác thực"}), 401
            
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            admin_id = payload['sub']
            admin_role = payload['role']
            
            if admin_role != 'super_admin':
                return jsonify({"message": "Không có quyền truy cập"}), 403
                
            # Kiểm tra admin có tồn tại trong database
            db = DatabaseManager()
            admin = db.fetch_one("SELECT * FROM admins WHERE id = %s AND role = 'super_admin'", (admin_id,))
            db.disconnect()
            
            if not admin:
                return jsonify({"message": "Token không hợp lệ"}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token đã hết hạn"}), 401
        except Exception as e:
            return jsonify({"message": f"Lỗi xác thực: {str(e)}"}), 401
            
        # Thêm thông tin admin vào request
        request.admin = {
            "id": admin_id,
            "role": admin_role
        }
        return f(*args, **kwargs)
        
    return decorated 