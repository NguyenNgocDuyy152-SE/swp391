"""
Main application module for the SWP391 backend API.
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from admin_routes import admin_bp
from functools import wraps
from flask_mail import Mail, Message
from cors_config import configure_cors
import logging
from config import APP_CONFIG, DB_CONFIG, EMAIL_CONFIG, validate_production_config

# Configure app logger
logger = logging.getLogger('app')

app = Flask(__name__)

# Configure CORS
app = configure_cors(app)

# Configure app settings
app.config['SECRET_KEY'] = APP_CONFIG['SECRET_KEY']
app.config['DEBUG'] = APP_CONFIG['DEBUG']

# Email Configuration
app.config['MAIL_SERVER'] = EMAIL_CONFIG['MAIL_SERVER']
app.config['MAIL_PORT'] = EMAIL_CONFIG['MAIL_PORT']
app.config['MAIL_USE_TLS'] = EMAIL_CONFIG['MAIL_USE_TLS']
app.config['MAIL_USERNAME'] = EMAIL_CONFIG['MAIL_USERNAME']
app.config['MAIL_PASSWORD'] = EMAIL_CONFIG['MAIL_PASSWORD']
app.config['MAIL_DEFAULT_SENDER'] = EMAIL_CONFIG['MAIL_DEFAULT_SENDER']

mail = Mail(app)

# Register admin blueprint
app.register_blueprint(admin_bp, url_prefix='/api/admin')

# Check if configuration is valid for production
if APP_CONFIG['ENVIRONMENT'] == 'production':
    if not validate_production_config():
        logger.error("Production configuration validation failed! Please check the log for details.")
        logger.warning("Application is starting with invalid production configuration.")

def get_db_connection():
    """Get a database connection from configuration"""
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except mysql.connector.Error as e:
        logger.error(f"Database connection error: {e}")
        raise

def create_users_table():
    # Connect to MySQL without specifying database
    conn = mysql.connector.connect(
        host=DB_CONFIG['host'],
        user=DB_CONFIG['user'],
        password=DB_CONFIG['password']
    )
    cursor = conn.cursor()
    
    # Create database if it doesn't exist
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']}")
    cursor.execute(f"USE {DB_CONFIG['database']}")
    
    # Create users table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'patient', 'doctor', 'staff') NOT NULL DEFAULT 'patient',
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        password_changed BOOLEAN DEFAULT TRUE
    )
    ''')
    
    # Create admins table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        status ENUM('active', 'inactive') DEFAULT 'active'
    )
    ''')
    
    # Create default admin account if not exists
    cursor.execute('SELECT * FROM admins WHERE username = "admin"')
    if not cursor.fetchone():
        hashed_password = generate_password_hash('admin123', method='sha256')
        cursor.execute('''
        INSERT INTO admins (username, password, name, email) 
        VALUES (%s, %s, %s, %s)
        ''', ('admin', hashed_password, 'Administrator', 'admin@example.com'))
        print("Created default admin account:")
        print("Username: admin")
        print("Password: admin123")
    
    # Create doctors table if it doesn't exist  
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        specialization VARCHAR(100) NOT NULL,
        qualification VARCHAR(100) NOT NULL,
        bio TEXT,
        phone VARCHAR(20),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    ''')
    
    # Create consultation_requests table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS consultation_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        service_type VARCHAR(100) NOT NULL,
        preferred_date DATE NOT NULL,
        preferred_time VARCHAR(50) NOT NULL,
        message TEXT,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create contact_messages table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('new', 'read', 'replied') NOT NULL DEFAULT 'new'
    )
    ''')
    
    conn.commit()
    cursor.close()
    conn.close()

def create_consultation_requests_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS consultation_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            service_type VARCHAR(255) NOT NULL,
            preferred_date DATE NOT NULL,
            preferred_time VARCHAR(50) NOT NULL,
            message TEXT,
            status ENUM('pending', 'confirmed', 'completed', 'canceled') NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    cursor.close()
    conn.close()

def create_doctors_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS doctors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            specialization VARCHAR(255) NOT NULL,
            qualification VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            bio TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    conn.commit()
    cursor.close()
    conn.close()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
            
        try:
            # Verify token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            
            # Kiểm tra xem 'user_id' có tồn tại trong data không
            if 'user_id' not in data:
                return jsonify({'message': 'Token is missing user_id'}), 401
            
            # Get current user
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute('SELECT id, name, email, role FROM users WHERE id = %s', (data['user_id'],))
            current_user = cursor.fetchone()
            cursor.close()
            conn.close()
            
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except KeyError as ke:
            return jsonify({'message': f'Token missing required field: {str(ke)}'}), 401
        except Exception as e:
            return jsonify({'message': f'Token is invalid: {str(e)}'}), 401
        
        # Add user to request context
        request.user = current_user
        return f(*args, **kwargs)
    
    return decorated

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated_function(*args, **kwargs):
            # Kiểm tra nếu user không có role hoặc role không hợp lệ
            if not request.user or 'role' not in request.user:
                return jsonify({'message': 'User role not defined'}), 401
            
            if request.user['role'] not in allowed_roles:
                return jsonify({'message': 'Permission denied'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'patient')  # Default to patient if role not provided

    if not all([name, email, password]):
        return jsonify({'message': 'Missing required fields'}), 400
        
    # Validate role
    if role not in ['patient', 'doctor', 'staff']:
        return jsonify({'message': 'Invalid role. Must be patient, doctor, or staff'}), 400

    hashed_password = generate_password_hash(password, method='sha256')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create user account
        cursor.execute(
            'INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)',
            (name, email, hashed_password, role)
        )
        user_id = cursor.lastrowid
        conn.commit()
        
        # If registering as a doctor, create entry in doctors table
        if role == 'doctor':
            specialization = data.get('specialization')
            qualification = data.get('qualification')
            
            if not all([specialization, qualification]):
                # Rollback if doctor fields are missing
                cursor.execute('DELETE FROM users WHERE id = %s', (user_id,))
                conn.commit()
                cursor.close()
                conn.close()
                return jsonify({'message': 'Doctor registration requires specialization and qualification'}), 400
                
            cursor.execute(
                'INSERT INTO doctors (user_id, specialization, qualification) VALUES (%s, %s, %s)',
                (user_id, specialization, qualification)
            )
            conn.commit()
        
        # If registering as a patient, create entry in patients table
        if role == 'patient':
            date_of_birth = data.get('date_of_birth')
            gender = data.get('gender')
            
            if date_of_birth and gender:
                cursor.execute(
                    'INSERT INTO patients (user_id, date_of_birth, gender) VALUES (%s, %s, %s)',
                    (user_id, date_of_birth, gender)
                )
                conn.commit()
        
        cursor.close()
        conn.close()
        return jsonify({'message': 'User registered successfully', 'user_id': user_id}), 201
    except mysql.connector.Error as err:
        if err.errno == 1062:  # Duplicate entry error
            return jsonify({'message': 'Email already exists'}), 400
        return jsonify({'message': f'Database error: {str(err)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'message': 'Missing required fields'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()

        if not user:
            cursor.close()
            conn.close()
            return jsonify({'message': 'Invalid credentials'}), 401
            
        # Kiểm tra nếu user đang đăng nhập là bác sĩ và có trạng thái active hoặc inactive
        if user['role'] == 'doctor':
            cursor.execute('SELECT * FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.id = %s', (user['id'],))
            doctor = cursor.fetchone()
            cursor.close()
            conn.close()
            
            if not doctor:
                return jsonify({'message': 'Doctor profile not found'}), 401
                
            # Kiểm tra trạng thái của bác sĩ
            if user.get('status') == 'inactive':
                return jsonify({'message': 'Your account has been deactivated. Please contact administrator.'}), 401
        else:
            cursor.close()
            conn.close()

        if check_password_hash(user['password'], password):
            # Đảm bảo role luôn tồn tại trong token
            role = user.get('role', 'patient')  # Mặc định là 'patient' nếu không có role
            
            token = jwt.encode({
                'user_id': user['id'],
                'email': user['email'],
                'role': role,
                'exp': datetime.utcnow() + timedelta(days=1)
            }, app.config['SECRET_KEY'])
            
            # Check if the user needs to change password
            # Đảm bảo xử lý an toàn nếu trường password_changed chưa tồn tại
            try:
                password_changed = 1
                if 'password_changed' in user:
                    password_changed = user['password_changed']
                
                user_data = {
                    'id': user['id'],
                    'name': user['name'],
                    'email': user['email'],
                    'role': user['role'],
                    'password_change_required': password_changed == 0
                }
            except Exception as e:
                print(f"Error processing user data: {str(e)}")
                # Trả về dữ liệu người dùng cơ bản nếu có lỗi
                user_data = {
                    'id': user['id'],
                    'name': user['name'],
                    'email': user['email'],
                    'role': user['role']
                }
            
            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user': user_data
            })
        return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/user/profile', methods=['GET'])
@token_required
def get_user_profile():
    user_id = request.user['id']
    role = request.user['role']
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Base user information
        user_info = {
            'id': request.user['id'],
            'name': request.user['name'],
            'email': request.user['email'],
            'role': role
        }
        
        # Role-specific information
        if role == 'doctor':
            cursor.execute('''
                SELECT d.* FROM doctors d
                WHERE d.user_id = %s
            ''', (user_id,))
            doctor_info = cursor.fetchone()
            if doctor_info:
                user_info['doctor_details'] = doctor_info
                
        elif role == 'patient':
            cursor.execute('''
                SELECT p.* FROM patients p
                WHERE p.user_id = %s
            ''', (user_id,))
            patient_info = cursor.fetchone()
            if patient_info:
                user_info['patient_details'] = patient_info
                
        cursor.close()
        conn.close()
        return jsonify({'user': user_info}), 200
    except Exception as e:
        return jsonify({'message': f'Error retrieving profile: {str(e)}'}), 500

# Doctor-specific routes
@app.route('/api/doctor/appointments', methods=['GET'])
@role_required(['doctor'])
def get_doctor_appointments():
    doctor_id = request.user['id']
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT a.*, u.name as patient_name 
            FROM appointments a
            JOIN users u ON a.patient_id = u.id
            WHERE a.doctor_id = %s
            ORDER BY a.appointment_date, a.appointment_time
        ''', (doctor_id,))
        appointments = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'appointments': appointments}), 200
    except Exception as e:
        return jsonify({'message': f'Error retrieving appointments: {str(e)}'}), 500

# Patient-specific routes
@app.route('/api/patient/appointments', methods=['GET'])
@role_required(['patient'])
def get_patient_appointments():
    patient_id = request.user['id']
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT a.*, u.name as doctor_name 
            FROM appointments a
            JOIN users u ON a.doctor_id = u.id
            WHERE a.patient_id = %s
            ORDER BY a.appointment_date, a.appointment_time
        ''', (patient_id,))
        appointments = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'appointments': appointments}), 200
    except Exception as e:
        return jsonify({'message': f'Error retrieving appointments: {str(e)}'}), 500

@app.route('/api/patient/treatments', methods=['GET'])
@role_required(['patient'])
def get_patient_treatments():
    patient_id = request.user['id']
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT t.*, u.name as doctor_name 
            FROM treatments t
            JOIN users u ON t.doctor_id = u.id
            WHERE t.patient_id = %s
        ''', (patient_id,))
        treatments = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'treatments': treatments}), 200
    except Exception as e:
        return jsonify({'message': f'Error retrieving treatments: {str(e)}'}), 500

# Staff-specific routes
@app.route('/api/staff/patients', methods=['GET'])
@role_required(['staff'])
def get_all_patients():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT u.id, u.name, u.email, u.created_at, p.*
            FROM users u
            LEFT JOIN patients p ON u.id = p.user_id
            WHERE u.role = 'patient'
        ''')
        patients = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'patients': patients}), 200
    except Exception as e:
        return jsonify({'message': f'Error retrieving patients: {str(e)}'}), 500

@app.route('/api/appointment/schedule', methods=['POST'])
def schedule_appointment():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['fullName', 'email', 'phone', 'serviceType', 'preferredDate', 'preferredTime']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Save the appointment request to the database
        query = '''
            INSERT INTO consultation_requests 
            (full_name, email, phone, service_type, preferred_date, preferred_time, message, status) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        '''
        values = (
            data['fullName'],
            data['email'],
            data['phone'],
            data['serviceType'],
            data['preferredDate'],
            data['preferredTime'],
            data.get('message', ''),
            'pending'
        )
        cursor.execute(query, values)
        request_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()
        
        # Send confirmation email
        try:
            send_confirmation_email(data)
            return jsonify({
                'message': 'Appointment request submitted successfully and confirmation email sent',
                'request_id': request_id
            }), 201
        except Exception as mail_error:
            print(f"Email sending failed: {str(mail_error)}")
            return jsonify({
                'message': 'Appointment request submitted successfully but confirmation email failed',
                'request_id': request_id
            }), 201
            
    except Exception as e:
        return jsonify({'message': f'Error scheduling appointment: {str(e)}'}), 500

def send_confirmation_email(appointment_data):
    """Send confirmation email to the user who requested an appointment"""
    subject = f"TINH TRUNG CHILL - Xác nhận đặt lịch tư vấn - {appointment_data['serviceType']}"
    
    # Format date and time for better readability
    date_obj = datetime.strptime(appointment_data['preferredDate'], '%Y-%m-%d')
    formatted_date = date_obj.strftime('%d/%m/%Y')
    
    body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="color: #0056b3; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px;">Xác Nhận Đặt Lịch Tư Vấn</h2>
            
            <p>Kính gửi <strong>{appointment_data['fullName']}</strong>,</p>
            
            <p>Cảm ơn bạn đã đặt lịch tư vấn tại TINH TRUNG CHILL. Chúng tôi đã nhận được yêu cầu đặt lịch của bạn với các thông tin sau:</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Dịch vụ:</strong> {appointment_data['serviceType']}</p>
                <p><strong>Ngày hẹn:</strong> {formatted_date}</p>
                <p><strong>Giờ hẹn:</strong> {appointment_data['preferredTime']}</p>
            </div>
            
            <p>Đội ngũ của chúng tôi sẽ liên hệ với bạn qua số điện thoại <strong>{appointment_data['phone']}</strong> trong thời gian sớm nhất để xác nhận lịch hẹn này.</p>
            
            <p>Nếu bạn cần thay đổi lịch hẹn hoặc có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email này hoặc gọi đến số hotline: <strong>0123 456 789</strong>.</p>
            
            <p style="margin-top: 20px;">Trân trọng,</p>
            <p><strong>Đội ngũ TINH TRUNG CHILL</strong></p>
            
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px;">
                <p>Email này được gửi tự động, vui lòng không trả lời email này.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Create and send email
    msg = Message(
        subject=subject,
        recipients=[appointment_data['email']],
        html=body
    )
    mail.send(msg)

@app.route('/api/user/change-password', methods=['POST'])
@token_required
def change_user_password():
    """Endpoint để người dùng thay đổi mật khẩu"""
    user_id = request.user['id']
    data = request.get_json()
    
    if not data or not data.get('current_password') or not data.get('new_password'):
        return jsonify({'message': 'Thiếu thông tin mật khẩu'}), 400
    
    if len(data.get('new_password')) < 8:
        return jsonify({'message': 'Mật khẩu mới phải có ít nhất 8 ký tự'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get user's current password
        cursor.execute('SELECT password FROM users WHERE id = %s', (user_id,))
        user = cursor.fetchone()
        
        if not user:
            cursor.close()
            conn.close()
            return jsonify({'message': 'Không tìm thấy người dùng'}), 404
        
        # Verify current password
        if not check_password_hash(user['password'], data['current_password']):
            cursor.close()
            conn.close()
            return jsonify({'message': 'Mật khẩu hiện tại không đúng'}), 401
        
        # Hash the new password
        hashed_password = generate_password_hash(data['new_password'], method='sha256')
        
        # Update password and set password_changed = 1
        cursor.execute(
            'UPDATE users SET password = %s, password_changed = 1 WHERE id = %s',
            (hashed_password, user_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Thay đổi mật khẩu thành công'}), 200
    
    except Exception as e:
        return jsonify({'message': f'Lỗi: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

def update_database_structure():
    """Cập nhật cấu trúc cơ sở dữ liệu nếu cần thiết"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Kiểm tra và cập nhật bảng users nếu cần
        try:
            cursor.execute("SHOW COLUMNS FROM users LIKE 'password_changed'")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE users ADD COLUMN password_changed TINYINT(1) DEFAULT 1 NOT NULL")
                print("Added password_changed field to users table")
        except Exception as e:
            print(f"Error updating users table: {e}")
        
        # Kiểm tra và tạo bảng doctors nếu chưa tồn tại
        cursor.execute("SHOW TABLES LIKE 'doctors'")
        if not cursor.fetchone():
            create_doctors_table()
            print("Created doctors table")
        
        conn.commit()
        cursor.close()
        conn.close()
        print("Database structure updated successfully")
    except Exception as e:
        print(f"Error updating database structure: {e}")

def create_test_doctor():
    """Tạo tài khoản bác sĩ mẫu để thử nghiệm nếu chưa có"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Xóa tài khoản test cũ nếu có
        print("Deleting existing test doctor account if exists...")
        try:
            cursor.execute("DELETE FROM doctors WHERE user_id IN (SELECT id FROM users WHERE email = 'doctor@example.com')")
            cursor.execute("DELETE FROM users WHERE email = 'doctor@example.com'")
            conn.commit()
        except Exception as e:
            print(f"Error deleting old test account: {e}")
            conn.rollback()
        
        print("Creating new test doctor account...")
        
        # Mật khẩu mặc định đơn giản: test123
        password = "test123"
        print(f"Test doctor password: {password}")
        
        # Sử dụng Werkzeug để hash mật khẩu
        from werkzeug.security import generate_password_hash
        # Chỉ định phương thức sha256 để đảm bảo nhất quán
        hashed_password = generate_password_hash(password, method='sha256')
        print(f"Hashed password: {hashed_password}")
        
        # Tạo tài khoản người dùng với vai trò bác sĩ
        cursor.execute('''
            INSERT INTO users (name, email, password, role, password_changed) 
            VALUES (%s, %s, %s, %s, %s)
        ''', ("Dr. Test Doctor", "doctor@example.com", hashed_password, "doctor", 0))
        user_id = cursor.lastrowid
        conn.commit()
        
        # Tạo thông tin bác sĩ
        cursor.execute('''
            INSERT INTO doctors (user_id, specialization, qualification, phone) 
            VALUES (%s, %s, %s, %s)
        ''', (user_id, "General Practice", "MD", "0123456789"))
        conn.commit()
        
        print(f"Created test doctor with ID {user_id}")
        
        cursor.close()
        conn.close()
        
        # Test đăng nhập luôn
        print("Testing login with the created account...")
        try:
            from werkzeug.security import check_password_hash
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE email = 'doctor@example.com'")
            user = cursor.fetchone()
            login_result = check_password_hash(user['password'], password)
            print(f"Login test result: {'SUCCESS' if login_result else 'FAILED'}")
            cursor.close()
        except Exception as e:
            print(f"Login test error: {e}")
            
    except Exception as e:
        print(f"Error creating test doctor: {e}")

@app.route('/api/debug/user', methods=['GET'])
def debug_user():
    """API debug: Tìm người dùng theo email"""
    email = request.args.get('email')
    if not email:
        return jsonify({'message': 'Missing email parameter'}), 400
        
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Tìm thông tin người dùng
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Bỏ mật khẩu ra khỏi kết quả
        if 'password' in user:
            user['password'] = '******'
            
        # Nếu là bác sĩ, lấy thêm thông tin bác sĩ
        if user['role'] == 'doctor':
            cursor.execute('SELECT * FROM doctors WHERE user_id = %s', (user['id'],))
            doctor = cursor.fetchone()
            if doctor:
                user['doctor_details'] = doctor
        
        cursor.close()
        conn.close()
        
        return jsonify({'user': user}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/debug/tables', methods=['GET'])
def debug_tables():
    """API debug: Liệt kê các bảng và cấu trúc"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Lấy danh sách bảng
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        result = {}
        
        for table in tables:
            table_name = list(table.values())[0]
            
            # Lấy cấu trúc bảng
            cursor.execute(f"DESCRIBE {table_name}")
            columns = cursor.fetchall()
            
            result[table_name] = columns
            
        cursor.close()
        conn.close()
        
        return jsonify({'tables': result}), 200
        
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/api/contact/submit', methods=['POST'])
def submit_contact_form():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email', 'phone', 'subject', 'message']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Save the contact message to the database
        query = '''
            INSERT INTO contact_messages 
            (name, email, phone, subject, message, created_at, status) 
            VALUES (%s, %s, %s, %s, %s, NOW(), %s)
        '''
        values = (
            data['name'],
            data['email'],
            data['phone'],
            data['subject'],
            data['message'],
            'new'
        )
        cursor.execute(query, values)
        message_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()
        
        # Send confirmation email
        try:
            send_contact_confirmation_email(data)
            return jsonify({
                'message': 'Your message has been sent successfully. We will contact you soon!',
                'message_id': message_id
            }), 201
        except Exception as mail_error:
            print(f"Contact confirmation email failed: {str(mail_error)}")
            return jsonify({
                'message': 'Your message has been sent successfully but confirmation email failed',
                'message_id': message_id
            }), 201
            
    except Exception as e:
        return jsonify({'message': f'Error submitting contact form: {str(e)}'}), 500

def send_contact_confirmation_email(contact_data):
    """Send confirmation email to the user who submitted a contact form"""
    subject = f"TINH TRUNG CHILL - Xác nhận đã nhận tin nhắn của bạn"
    
    body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="color: #0056b3; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px;">Xác Nhận Đã Nhận Tin Nhắn</h2>
            
            <p>Kính gửi <strong>{contact_data['name']}</strong>,</p>
            
            <p>Cảm ơn bạn đã liên hệ với TINH TRUNG CHILL. Chúng tôi đã nhận được tin nhắn của bạn với nội dung sau:</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Chủ đề:</strong> {contact_data['subject']}</p>
                <p><strong>Nội dung:</strong> {contact_data['message']}</p>
            </div>
            
            <p>Đội ngũ của chúng tôi sẽ xem xét tin nhắn của bạn và phản hồi trong thời gian sớm nhất.</p>
            
            <p>Nếu bạn có bất kỳ câu hỏi nào khác, vui lòng liên hệ với chúng tôi qua email hoặc gọi đến số hotline: <strong>0123 456 789</strong>.</p>
            
            <p style="margin-top: 20px;">Trân trọng,</p>
            <p><strong>Đội ngũ TINH TRUNG CHILL</strong></p>
            
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px;">
                <p>Email này được gửi tự động, vui lòng không trả lời email này.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Create and send email
    msg = Message(
        subject=subject,
        recipients=[contact_data['email']],
        html=body
    )
    mail.send(msg)

@app.route("/")
def home():
    return "Backend is running!"

if __name__ == '__main__':
    create_users_table()
    create_consultation_requests_table()
    create_doctors_table()
    update_database_structure()
    
    # Only create test doctor in development
    if APP_CONFIG['ENVIRONMENT'] == 'development':
        create_test_doctor()
    
    # Get port from environment variable for Render.com or use default 5001
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=APP_CONFIG['ENVIRONMENT'] == 'development') 