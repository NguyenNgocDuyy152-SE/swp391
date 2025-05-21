# SWP391 Production Deployment Guide

This guide provides instructions for deploying the application to a production environment securely.

## Pre-Deployment Checklist

- [ ] All environment variables are properly set
- [ ] Database credentials are secure and not hardcoded
- [ ] Debug mode is disabled
- [ ] All sensitive data is properly encrypted
- [ ] All dependencies are updated to secure versions
- [ ] All tests pass
- [ ] Error handling is implemented properly
- [ ] Logging is configured properly
- [ ] Database migrations are prepared
- [ ] Backups are configured

## Environment Setup

1. Set up a production environment (e.g., Ubuntu server, Docker container)
2. Install required system dependencies:
   ```bash
   apt-get update && apt-get install -y python3 python3-pip mysql-client libmysqlclient-dev
   ```
3. Copy the production environment template:
   ```bash
   cp backend/production.env.template backend/.env
   ```
4. Edit the `.env` file with your production values:
   ```bash
   nano backend/.env
   ```
5. Set proper permissions:
   ```bash
   chmod 600 backend/.env
   ```

## Database Setup

1. Create a dedicated database user with restricted privileges
   ```sql
   CREATE USER 'swp391_user'@'%' IDENTIFIED BY 'your_secure_password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON swp391.* TO 'swp391_user'@'%';
   FLUSH PRIVILEGES;
   ```
2. Make sure the database schema is up to date:
   ```bash
   python backend/app.py --init-db
   ```

## Backend Deployment

### Option 1: Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t swp391-backend ./backend
   ```
2. Run the container:
   ```bash
   docker run -d -p 5001:5001 --env-file backend/.env --name swp391-backend swp391-backend
   ```

### Option 2: Manual Deployment

1. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Run with gunicorn:
   ```bash
   cd backend
   gunicorn --bind 0.0.0.0:5001 app:app --workers=4 --timeout=120
   ```

## Frontend Deployment

1. Build the production version of the frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Deploy the built static files to your web server (Nginx, Apache)

## Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name yourdomainname.com;

    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomainname.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # SSL/TLS configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Frontend files
    location / {
        root /path/to/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Security Hardening

1. Set up SSL/TLS certificates (Let's Encrypt is a free option)
2. Configure proper CORS settings in `cors_config.py`
3. Set up rate limiting for critical endpoints
4. Enable HTTP security headers:
   - X-Content-Type-Options
   - X-Frame-Options
   - Content-Security-Policy
   - Strict-Transport-Security
5. Set up firewall rules to restrict access to the server
6. Implement fail2ban to protect against brute force attacks
7. Set up regular security updates

## Monitoring

1. Set up server monitoring (CPU, memory, disk usage)
2. Set up application monitoring
3. Configure log rotation and aggregation
4. Set up alerts for critical events

## Backup Strategy

1. Regular database backups
2. Store backups in a secure and separate location
3. Test restoration process regularly

## Post-Deployment Verification

- [ ] All pages load correctly
- [ ] Authentication works
- [ ] API endpoints return correct responses
- [ ] Error pages are displayed correctly
- [ ] Forms submit data correctly
- [ ] Email notifications work
- [ ] SSL/TLS configuration works properly (check with SSL Labs)

## Maintenance

1. Set up a regular update schedule for dependencies
2. Monitor for security vulnerabilities using tools like OWASP ZAP
3. Regularly review logs for potential issues

## Rollback Plan

1. Document the process for rolling back to a previous version
2. Keep a copy of previous working configurations and database dumps

## Troubleshooting

- Check logs: `tail -f /var/log/your-app.log`
- Check database connection: `mysql -u user -p -h host dbname`
- Check application status: `systemctl status your-app`
- Check nginx status: `nginx -t` and `systemctl status nginx` 