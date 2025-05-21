#!/bin/bash

echo "Testing deployment setup for SWP391..."

# Check if Python is installed
python_version=$(python --version 2>&1)
if [ $? -ne 0 ]; then
  echo "Error: Python is not installed or not in PATH!"
  exit 1
else
  echo "✅ Python detected: $python_version"
fi

# Check if Node is installed
node_version=$(node --version 2>&1)
if [ $? -ne 0 ]; then
  echo "Error: Node.js is not installed or not in PATH!"
  exit 1
else
  echo "✅ Node.js detected: $node_version"
fi

# Check backend setup
echo "Checking backend setup..."
cd backend
if [ ! -f "requirements.txt" ]; then
  echo "Error: requirements.txt not found in backend directory!"
  exit 1
else
  echo "✅ requirements.txt found"
fi

if [ ! -f "app.py" ]; then
  echo "Error: app.py not found in backend directory!"
  exit 1
else
  echo "✅ app.py found"
fi

# Test running the backend with gunicorn
echo "Testing backend with gunicorn..."
if ! command -v gunicorn &> /dev/null; then
  echo "⚠️ Warning: gunicorn not installed. Installing..."
  pip install gunicorn
fi

echo "Starting backend server with gunicorn (will run for 5 seconds)..."
gunicorn app:app --log-level debug &
BACKEND_PID=$!
sleep 5
kill $BACKEND_PID
echo "✅ Backend tested with gunicorn"

# Check frontend setup
cd ../frontend
echo "Checking frontend setup..."
if [ ! -f "package.json" ]; then
  echo "Error: package.json not found in frontend directory!"
  exit 1
else
  echo "✅ package.json found"
fi

# Test building the frontend
echo "Testing frontend build..."
npm install --silent
npm run build

if [ ! -d "build" ]; then
  echo "Error: Frontend build failed!"
  exit 1
else
  echo "✅ Frontend build succeeded"
fi

cd ..
echo ""
echo "✅ Deployment test completed successfully!"
echo "Your project appears ready for deployment to Render.com."
echo "Remember to check the DEPLOYMENT.md file for detailed instructions." 