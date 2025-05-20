from flask import Blueprint, request, jsonify
from admin_auth import login_admin, admin_required, super_admin_required
from db_utils import DatabaseManager

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/login', methods=['POST'])
def login():
    """API đăng nhập cho admin"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"message": "Thiếu thông tin đăng nhập"}), 400
    
    result = login_admin(data.get('username'), data.get('password'))
    
    if result['success']:
        return jsonify(result), 200
    else:
        return jsonify(result), 401

@admin_bp.route('/profile', methods=['GET'])
@admin_required
def get_profile():
    """Lấy thông tin profile của admin đang đăng nhập"""
    admin_id = request.admin['id']
    
    db = DatabaseManager()
    admin = db.fetch_one("SELECT id, username, role, last_login, created_at FROM admins WHERE id = %s", (admin_id,))
    db.disconnect()
    
    if not admin:
        return jsonify({"message": "Không tìm thấy thông tin admin"}), 404
    
    return jsonify({"admin": admin}), 200

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    """Lấy danh sách người dùng"""
    db = DatabaseManager()
    users = db.execute_select("SELECT id, name, email, created_at FROM users")
    db.disconnect()
    
    return jsonify({"users": users}), 200

@admin_bp.route('/admins', methods=['GET'])
@super_admin_required
def get_admins():
    """Lấy danh sách admin (chỉ super_admin)"""
    db = DatabaseManager()
    admins = db.execute_select("SELECT id, username, role, last_login, created_at FROM admins")
    db.disconnect()
    
    return jsonify({"admins": admins}), 200

@admin_bp.route('/admins', methods=['POST'])
@super_admin_required
def create_admin():
    """Tạo admin mới (chỉ super_admin)"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password') or not data.get('role'):
        return jsonify({"message": "Thiếu thông tin admin"}), 400
    
    # Kiểm tra username unique
    db = DatabaseManager()
    exists = db.record_exists("admins", f"username = '{data['username']}'")
    
    if exists:
        return jsonify({"message": "Username đã tồn tại"}), 409
    
    # Mã hóa mật khẩu
    from argon2 import PasswordHasher
    ph = PasswordHasher()
    hashed_password = ph.hash(data['password'])
    
    # Thêm admin mới
    admin_data = {
        "username": data['username'],
        "password": hashed_password,
        "role": data['role']
    }
    
    admin_id = db.insert_data("admins", admin_data)
    db.disconnect()
    
    if not admin_id:
        return jsonify({"message": "Không thể tạo admin"}), 500
        
    return jsonify({
        "message": "Tạo admin thành công", 
        "admin_id": admin_id
    }), 201

@admin_bp.route('/admins/<int:admin_id>', methods=['DELETE'])
@super_admin_required
def delete_admin(admin_id):
    """Xóa admin (chỉ super_admin)"""
    # Không cho phép xóa chính mình
    if str(admin_id) == str(request.admin['id']):
        return jsonify({"message": "Không thể xóa tài khoản của chính bạn"}), 400
    
    db = DatabaseManager()
    success = db.delete_data("admins", f"id = {admin_id}")
    db.disconnect()
    
    if not success:
        return jsonify({"message": "Không thể xóa admin"}), 500
        
    return jsonify({"message": "Xóa admin thành công"}), 200

@admin_bp.route('/change-password', methods=['POST'])
@admin_required
def change_password():
    """Thay đổi mật khẩu của admin đang đăng nhập"""
    admin_id = request.admin['id']
    data = request.get_json()
    
    if not data or not data.get('current_password') or not data.get('new_password'):
        return jsonify({"message": "Thiếu thông tin mật khẩu"}), 400
    
    db = DatabaseManager()
    admin = db.fetch_one("SELECT password FROM admins WHERE id = %s", (admin_id,))
    
    if not admin:
        return jsonify({"message": "Không tìm thấy thông tin admin"}), 404
    
    # Kiểm tra mật khẩu hiện tại
    from argon2 import PasswordHasher
    from argon2.exceptions import VerifyMismatchError
    
    ph = PasswordHasher()
    try:
        ph.verify(admin['password'], data['current_password'])
    except VerifyMismatchError:
        return jsonify({"message": "Mật khẩu hiện tại không đúng"}), 401
    except Exception:
        return jsonify({"message": "Lỗi xác thực mật khẩu"}), 500
    
    # Mã hóa mật khẩu mới
    hashed_password = ph.hash(data['new_password'])
    
    # Cập nhật mật khẩu
    success = db.update_data("admins", {"password": hashed_password}, f"id = {admin_id}")
    db.disconnect()
    
    if not success:
        return jsonify({"message": "Không thể cập nhật mật khẩu"}), 500
        
    return jsonify({"message": "Cập nhật mật khẩu thành công"}), 200 