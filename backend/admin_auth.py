from flask import request, jsonify
from functools import wraps
import jwt
import datetime
import os
from dotenv import load_dotenv
from admin_utils import AdminManager

# Tải biến môi trường
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-123')
TOKEN_EXPIRE_HOURS = 24  # Token hết hạn sau 24 giờ

admin_manager = AdminManager()

def generate_token(user_id, username, role):
    """Tạo JWT token cho admin"""
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=TOKEN_EXPIRE_HOURS),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id,
        'username': username,
        'role': role
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def login_admin(username, password):
    """Đăng nhập admin và trả về token nếu thành công"""
    if not username or not password:
        return {"success": False, "message": "Vui lòng nhập đầy đủ thông tin"}
        
    try:
        # Get admin details
        admin = admin_manager.get_admin_by_username(username)
        if not admin:
            return {"success": False, "message": "Tài khoản không tồn tại"}
            
        # Verify password
        if not admin_manager.verify_admin_password(username, password):
            return {"success": False, "message": "Mật khẩu không đúng"}
            
        if admin.get('status') == 'inactive':
            return {"success": False, "message": "Tài khoản đã bị vô hiệu hóa"}
            
        # Update last login time
        admin_manager.update_last_login(admin['id'])
        
        # Generate token
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
                "role": admin.get('role', 'admin')
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
            
            # Kiểm tra admin có tồn tại và đang active
            admin = admin_manager.get_admin(admin_id)
            if not admin or admin.get('status') != 'active':
                return jsonify({"message": "Token không hợp lệ hoặc tài khoản đã bị vô hiệu hóa"}), 401
                
            # Thêm thông tin admin vào request
            request.admin = admin
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
                
            # Kiểm tra admin có tồn tại và là super admin
            admin = admin_manager.get_admin(admin_id)
            if not admin or admin.get('role') != 'super_admin':
                return jsonify({"message": "Token không hợp lệ"}), 401
                
            # Thêm thông tin admin vào request
            request.admin = admin
            return f(*args, **kwargs)
            
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token đã hết hạn"}), 401
        except Exception as e:
            return jsonify({"message": f"Lỗi xác thực: {str(e)}"}), 401
            
        return f(*args, **kwargs)
        
    return decorated 