from flask import Blueprint, request, jsonify, make_response
from admin_auth import login_admin, admin_required, super_admin_required
from db_utils import DatabaseManager
from werkzeug.security import generate_password_hash

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    """API đăng nhập cho admin"""
    # OPTIONS requests are already handled by Flask-CORS
    if request.method == 'OPTIONS':
        return '', 204
        
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
def get_admin_profile():
    """Lấy thông tin profile của admin đang đăng nhập"""
    try:
        admin_id = request.admin['id']
        db = DatabaseManager()
        admin = db.fetch_one(
            "SELECT id, username, name, email, role, last_login FROM admins WHERE id = %s",
            (admin_id,)
        )
        
        if not admin:
            return jsonify({"message": "Không tìm thấy thông tin admin"}), 404
            
        return jsonify({
            "success": True,
            "admin": {
                "id": admin['id'],
                "username": admin['username'],
                "name": admin['name'],
                "email": admin['email'],
                "role": admin['role'],
                "last_login": admin['last_login'].isoformat() if admin['last_login'] else None
            }
        })
        
    except Exception as e:
        print(f"Error getting admin profile: {str(e)}")
        return jsonify({"message": f"Lỗi khi lấy thông tin: {str(e)}"}), 500

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

@admin_bp.route('/doctors', methods=['POST'])
@admin_required
def add_doctor():
    """Thêm bác sĩ mới và tạo tài khoản tự động"""
    data = request.get_json()
    
    required_fields = ['name', 'email', 'specialization', 'qualification', 'phone']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"message": f"Thiếu thông tin: {field}"}), 400
    
    db = DatabaseManager()
    
    # Kiểm tra email đã tồn tại chưa
    if db.record_exists("users", f"email = '{data['email']}'"):
        db.disconnect()
        return jsonify({"message": "Email đã được sử dụng"}), 409
    
    try:
        # Tạo mật khẩu mặc định
        default_password = "12345678"
        hashed_password = generate_password_hash(default_password)
        
        # Tạo tài khoản người dùng với vai trò bác sĩ
        user_data = {
            "name": data['name'],
            "email": data['email'],
            "password": hashed_password,
            "role": "doctor",
            "status": data.get('status', 'active'),  # Mặc định là active nếu không được cung cấp
            "password_changed": 0  # Cờ để đánh dấu người dùng cần thay đổi mật khẩu
        }
        
        # Thêm tài khoản user
        user_id = db.insert_data("users", user_data)
        if not user_id:
            db.disconnect()
            return jsonify({"message": "Không thể tạo tài khoản bác sĩ"}), 500
            
        # Thêm thông tin bác sĩ
        doctor_data = {
            "user_id": user_id,
            "specialization": data['specialization'],
            "qualification": data['qualification'],
            "phone": data['phone']
        }
        
        if 'bio' in data:
            doctor_data["bio"] = data['bio']
            
        doctor_id = db.insert_data("doctors", doctor_data)
        if not doctor_id:
            # Nếu không thêm được thông tin bác sĩ, xóa user đã tạo
            db.delete_data("users", f"id = {user_id}")
            db.disconnect()
            return jsonify({"message": "Không thể tạo thông tin chi tiết bác sĩ"}), 500
        
        db.disconnect()
        return jsonify({
            "message": "Thêm bác sĩ thành công", 
            "user_id": user_id,
            "doctor_id": doctor_id,
            "default_password": default_password
        }), 201
        
    except Exception as e:
        db.disconnect()
        return jsonify({"message": f"Lỗi khi tạo bác sĩ: {str(e)}"}), 500

@admin_bp.route('/doctors', methods=['GET'])
@admin_required
def get_doctors():
    """Lấy danh sách bác sĩ"""
    db = DatabaseManager()
    
    query = """
    SELECT u.id, u.name, u.email, u.created_at, u.status, d.specialization, d.qualification, d.phone, u.password_changed
    FROM users u
    JOIN doctors d ON u.id = d.user_id
    WHERE u.role = 'doctor'
    """
    
    doctors = db.execute_select(query)
    db.disconnect()
    
    return jsonify({"doctors": doctors}), 200

@admin_bp.route('/doctors/<int:doctor_id>', methods=['DELETE'])
@admin_required
def delete_doctor(doctor_id):
    """Xóa bác sĩ"""
    db = DatabaseManager()
    
    # Lấy user_id từ doctor_id
    doctor = db.fetch_one("SELECT user_id FROM doctors WHERE id = %s", (doctor_id,))
    if not doctor:
        db.disconnect()
        return jsonify({"message": "Không tìm thấy bác sĩ"}), 404
    
    user_id = doctor['user_id']
    
    # Xóa thông tin bác sĩ
    db.delete_data("doctors", f"id = {doctor_id}")
    
    # Xóa tài khoản người dùng
    db.delete_data("users", f"id = {user_id}")
    
    db.disconnect()
    return jsonify({"message": "Xóa bác sĩ thành công"}), 200

@admin_bp.route('/doctors/<int:user_id>/status', methods=['PUT'])
@admin_required
def update_doctor_status(user_id):
    """Cập nhật trạng thái bác sĩ"""
    data = request.get_json()
    
    if not data or 'status' not in data:
        return jsonify({"message": "Thiếu thông tin trạng thái"}), 400
        
    status = data['status']
    if status not in ['active', 'inactive']:
        return jsonify({"message": "Trạng thái không hợp lệ. Chỉ chấp nhận 'active' hoặc 'inactive'"}), 400
    
    db = DatabaseManager()
    
    # Kiểm tra xem user có tồn tại và có phải là bác sĩ không
    user = db.fetch_one("SELECT id, role FROM users WHERE id = %s AND role = 'doctor'", (user_id,))
    
    if not user:
        db.disconnect()
        return jsonify({"message": "Không tìm thấy bác sĩ"}), 404
    
    # Cập nhật trạng thái trong bảng users
    success = db.update_data("users", {"status": status}, f"id = {user_id}")
    
    db.disconnect()
    
    if not success:
        return jsonify({"message": "Không thể cập nhật trạng thái bác sĩ"}), 500
        
    return jsonify({"message": "Cập nhật trạng thái bác sĩ thành công"}), 200 