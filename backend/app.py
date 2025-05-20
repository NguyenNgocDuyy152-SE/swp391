from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv
import os
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from admin_routes import admin_bp  # Import blueprint admin
from functools import wraps
from flask_mail import Mail, Message

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-123')

# Email Configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'your-email@gmail.com')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', 'your-app-password')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'TINH TRUNG CHILL <your-email@gmail.com>')

mail = Mail(app)

# Register admin blueprint
app.register_blueprint(admin_bp, url_prefix='/api/admin')

# Database configuration
db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'swp391')
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

def create_users_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('patient', 'doctor', 'staff') NOT NULL DEFAULT 'patient',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

    hashed_password = generate_password_hash(password)
    
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
        cursor.close()
        conn.close()

        if user and check_password_hash(user['password'], password):
            # Đảm bảo role luôn tồn tại trong token
            role = user.get('role', 'patient')  # Mặc định là 'patient' nếu không có role
            
            token = jwt.encode({
                'user_id': user['id'],
                'email': user['email'],
                'role': role,
                'exp': datetime.utcnow() + timedelta(days=1)
            }, app.config['SECRET_KEY'])
            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user': {
                    'id': user['id'],
                    'name': user['name'],
                    'email': user['email'],
                    'role': user['role']
                }
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

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    create_users_table()
    create_consultation_requests_table()
    app.run(debug=True) 