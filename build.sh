#!/bin/bash

# This script prepares the application for deployment

# Exit on error
set -e

echo "Preparing application for deployment..."

# Setup backend
echo "Setting up backend..."
cd backend
pip install -r requirements.txt
cd ..

# Setup frontend
echo "Setting up frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Build completed successfully!"
echo "You can now deploy the application to Render.com" 