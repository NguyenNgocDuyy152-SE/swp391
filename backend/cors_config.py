from flask import Flask
from flask_cors import CORS

def configure_cors(app):
    """
    Cấu hình CORS cho toàn bộ ứng dụng Flask, bao gồm tất cả các blueprints.
    """
    # Cấu hình CORS cho tất cả route
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # We don't need to add headers manually since CORS() does that
    # Instead, we can add any additional headers not handled by flask-cors
    @app.after_request
    def after_request(response):
        if 'Access-Control-Allow-Origin' not in response.headers:
            response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    return app 