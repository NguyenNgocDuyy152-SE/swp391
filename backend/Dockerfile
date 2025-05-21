FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    ENVIRONMENT=production

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN addgroup --system app && adduser --system --group app

# Set up virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Ensure proper permissions
RUN chown -R app:app /app

# Switch to non-root user
USER app

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app", "--workers=4", "--timeout=120"] 