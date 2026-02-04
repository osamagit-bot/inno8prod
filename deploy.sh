#!/bin/bash
set -e
echo "🚀 Starting Inno8 Solutions deployment..."

# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y nginx python3 python3-pip python3-venv nodejs npm git curl

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Setup Python virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup Django
python manage.py collectstatic --noinput
python manage.py migrate

# Setup Next.js
cd ..
npm install
npm run build

echo "✅ Basic setup completed!"
