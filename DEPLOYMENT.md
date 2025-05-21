# Deployment Guide for SWP391 Healthcare Website

This guide explains how to deploy the SWP391 Healthcare Website to Render.com.

## Prerequisites

1. A Render.com account
2. A MySQL database (you can use Render's PostgreSQL or an external MySQL provider like PlanetScale or AWS RDS)
3. Git repository with your codebase

## Deployment Steps

### 1. Database Setup

1. Set up your MySQL database using your preferred provider
2. Note down the database credentials:
   - Host
   - Username
   - Password
   - Database name

### 2. Deploy to Render.com

1. Log in to your Render.com account
2. Connect your GitHub/GitLab repository to Render
3. Click on "New" and select "Blueprint" to use the render.yaml configuration
4. Follow the prompts to deploy your application

### 3. Configure Environment Variables

After deployment, configure the required environment variables in the Render dashboard:

**For Backend Service:**
- `DB_HOST`: Your database host URL
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `SECRET_KEY`: A secret key for JWT token generation
- `MAIL_SERVER`: Your email SMTP server (e.g., smtp.gmail.com)
- `MAIL_PORT`: SMTP port (e.g., 587)
- `MAIL_USERNAME`: Your email username
- `MAIL_PASSWORD`: Your email password or app password
- `MAIL_DEFAULT_SENDER`: Default sender email

**For Frontend Service:**
- `REACT_APP_API_URL`: URL of your deployed backend service

### 4. Database Initialization

The application will automatically create the necessary database tables when it starts. For initial admin setup, you may need to run the `create_admin.py` script.

### 5. Verify Deployment

1. Test the backend health check endpoint: `https://your-backend-url.onrender.com/api/health`
2. Visit your frontend application: `https://your-frontend-url.onrender.com`

## Troubleshooting

- Check Render.com logs if the application fails to start
- Verify that all environment variables are correctly set
- Ensure the database connection is properly configured and accessible from Render

## Maintenance

- Monitor your application using Render's dashboard
- Set up appropriate scaling as needed
- Implement database backups for production data 