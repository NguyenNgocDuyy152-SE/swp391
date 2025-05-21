# SWP391 - TINH TRUNG CHILL Project

A web application for a medical center specializing in reproductive health.

## Project Structure

- **Frontend**: React application
- **Backend**: Flask API

## Deployment to Render.com

### Prerequisites

1. Create a Render.com account
2. Set up a MySQL database (can use Render.com's database service or external service)

### Deployment Steps

1. Push your code to a GitHub repository
2. In Render.com Dashboard, click "New" and select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file and set up the services
5. Configure the environment variables in Render dashboard:
   - Database credentials
   - Email configuration
   - Secret key

### Environment Variables

#### Backend
- `DB_HOST`: MySQL database host
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `SECRET_KEY`: Secret key for JWT
- `MAIL_SERVER`: SMTP server address
- `MAIL_PORT`: SMTP server port
- `MAIL_USERNAME`: Email username
- `MAIL_PASSWORD`: Email password
- `MAIL_DEFAULT_SENDER`: Default email sender

#### Frontend
- `REACT_APP_API_URL`: URL of the backend API

## Local Development

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Database Setup

The application will automatically create the required tables when started. For production, it's recommended to set up the database structure manually.

## Features

- Modern responsive navbar
- Clean and simple homepage design
- RESTful API backend
- MySQL database integration
- CORS enabled for frontend-backend communication 