"""
Configuration module for the application.

This module centralizes all configuration settings and provides environment variable validation.
"""

import os
from dotenv import load_dotenv
import logging
import secrets
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger('config')

# Load environment variables
load_dotenv()

# Required environment variables
REQUIRED_ENV_VARS = [
    'DB_PASSWORD',
    'SECRET_KEY'
]

# Check for missing required environment variables
missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
    for var in missing_vars:
        logger.error(f"Required environment variable '{var}' is not set")
    
    if 'SECRET_KEY' in missing_vars:
        # Generate a SECRET_KEY for development but warn user
        random_key = secrets.token_hex(32)
        os.environ['SECRET_KEY'] = random_key
        logger.warning(f"Generated a random SECRET_KEY for development. DO NOT use this in production.")
    else:
        logger.error("Application cannot start with missing required environment variables")
        sys.exit(1)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', '127.0.0.1'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME', 'swp391'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'connection_timeout': 30,
    'autocommit': True,
    'charset': 'utf8mb4',
    'use_pure': True
}

# Application configuration
APP_CONFIG = {
    'DEBUG': os.getenv('FLASK_DEBUG', 'True').lower() in ('true', '1', 't'),
    'ENVIRONMENT': os.getenv('FLASK_ENV', 'development'),
    'SECRET_KEY': os.getenv('SECRET_KEY', 'your-super-secret-key-f8e7a6b5c4d3e2f1a9b8c7d6e5f4g3h2i1j0'),
    'PORT': int(os.getenv('PORT', 5001)),
    'JWT_EXPIRATION_HOURS': int(os.getenv('JWT_EXPIRATION_HOURS', 24)),
}

# Email configuration
EMAIL_CONFIG = {
    'MAIL_SERVER': os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
    'MAIL_PORT': int(os.getenv('MAIL_PORT', 587)),
    'MAIL_USE_TLS': os.getenv('MAIL_USE_TLS', 'True').lower() in ('true', '1', 't'),
    'MAIL_USERNAME': os.getenv('MAIL_USERNAME'),
    'MAIL_PASSWORD': os.getenv('MAIL_PASSWORD'),
    'MAIL_DEFAULT_SENDER': os.getenv('MAIL_DEFAULT_SENDER'),
}

# Security settings
PASSWORD_POLICY = {
    'MIN_LENGTH': 8,
    'REQUIRE_UPPERCASE': True,
    'REQUIRE_LOWERCASE': True,
    'REQUIRE_NUMBERS': True,
    'REQUIRE_SPECIAL_CHARS': True,
}

# Rate limiting
RATE_LIMITS = {
    'DEFAULT': '100 per minute',
    'LOGIN': '5 per minute',
}

# Function to validate that the configuration is suitable for production
def validate_production_config():
    """Validate that the configuration is suitable for production"""
    if APP_CONFIG['ENVIRONMENT'] != 'production':
        return True
    
    errors = []
    
    # Check for secure database password
    if DB_CONFIG['password'] and len(DB_CONFIG['password']) < 12:
        errors.append("Database password is too weak for production")
    
    # Check for secure secret key
    if len(APP_CONFIG['SECRET_KEY']) < 32:
        errors.append("SECRET_KEY is too short for production")
    
    # Check debug mode
    if APP_CONFIG['DEBUG']:
        errors.append("DEBUG mode is enabled in production")
        
    # Check email configuration
    if not all([EMAIL_CONFIG['MAIL_USERNAME'], EMAIL_CONFIG['MAIL_PASSWORD'], EMAIL_CONFIG['MAIL_DEFAULT_SENDER']]):
        errors.append("Email configuration is incomplete")
        
    if errors:
        for error in errors:
            logger.error(f"Production config validation error: {error}")
        return False
        
    return True 