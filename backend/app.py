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

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-123')

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
            token = jwt.encode({
                'user_id': user['id'],
                'email': user['email'],
                'role': user['role'],
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

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    create_users_table()
    app.run(debug=True) 