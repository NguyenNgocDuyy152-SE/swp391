# Simple Website with React Frontend and Python Backend

This project consists of a React frontend with Tailwind CSS and a Python Flask backend with MySQL database.

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

## Backend Setup

1. Install Python (if not already installed)
2. Navigate to the backend directory:
```bash
cd backend
```

3. Create a virtual environment:
```bash
python -m venv venv
```

4. Activate the virtual environment:
- Windows:
```bash
venv\Scripts\activate
```
- Unix/MacOS:
```bash
source venv/bin/activate
```

5. Install dependencies:
```bash
pip install -r requirements.txt
```

6. Create a `.env` file based on `.env.example` and configure your database settings

7. Start the backend server:
```bash
python app.py
```

The backend will be available at http://localhost:5000

## Database Setup

1. Install MySQL if not already installed
2. Create a new database
3. Update the `.env` file with your database credentials

## Features

- Modern responsive navbar
- Clean and simple homepage design
- RESTful API backend
- MySQL database integration
- CORS enabled for frontend-backend communication 