#!/bin/bash

# Community Connect - One-Click Deployment Script for EC2 Ubuntu
# This script installs and configures everything needed to run the application

set -e  # Exit on any error

echo "=========================================="
echo "Community Connect Deployment Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run as root. Run as ubuntu user."
    exit 1
fi

print_info "Starting deployment process..."

# Update system
print_info "Updating system packages..."
sudo apt update
sudo apt upgrade -y
print_success "System updated"

# Install Node.js 20.x
print_info "Installing Node.js 20.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    print_success "Node.js installed: $(node -v)"
else
    print_success "Node.js already installed: $(node -v)"
fi

# Install PM2 globally
print_info "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    pm2 startup | tail -n 1 | sudo bash
    print_success "PM2 installed"
else
    print_success "PM2 already installed"
fi

# Install Nginx
print_info "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    sudo systemctl enable nginx
    print_success "Nginx installed"
else
    print_success "Nginx already installed"
fi

# Install MongoDB
print_info "Installing MongoDB..."
if ! command -v mongod &> /dev/null; then
    sudo apt install -y gnupg curl
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
        sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
        sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    sudo apt update
    sudo apt install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
    print_success "MongoDB installed and started"
else
    print_success "MongoDB already installed"
    sudo systemctl start mongod || true
fi

# Get current directory
DEPLOY_DIR=$(pwd)
print_info "Deploying from: $DEPLOY_DIR"

# Install backend dependencies
print_info "Installing backend dependencies..."
cd "$DEPLOY_DIR/backend"
npm install --production
print_success "Backend dependencies installed"

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd "$DEPLOY_DIR/frontend"
npm install
print_success "Frontend dependencies installed"

# Build frontend
print_info "Building frontend..."
npm run build
print_success "Frontend built successfully"

# Create .env file for backend if not exists
print_info "Setting up environment variables..."
cd "$DEPLOY_DIR/backend"
if [ ! -f .env ]; then
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/community-connect
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF
    print_success "Backend .env created"
else
    print_success "Backend .env already exists"
fi

# Create .env.local for frontend if not exists
cd "$DEPLOY_DIR/frontend"
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
EOF
    print_success "Frontend .env.local created"
else
    print_success "Frontend .env.local already exists"
fi

# Stop existing PM2 processes
print_info "Stopping existing PM2 processes..."
pm2 delete community-connect-backend 2>/dev/null || true
pm2 delete community-connect-frontend 2>/dev/null || true
print_success "Stopped old processes"

# Start backend with PM2
print_info "Starting backend with PM2..."
cd "$DEPLOY_DIR/backend"
pm2 start server.js --name community-connect-backend --time
print_success "Backend started on port 5000"

# Start frontend with PM2
print_info "Starting frontend with PM2..."
cd "$DEPLOY_DIR/frontend"
pm2 start npm --name community-connect-frontend --time -- start
print_success "Frontend started on port 3000"

# Save PM2 configuration
pm2 save
print_success "PM2 configuration saved"

# Configure Nginx
print_info "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/community-connect > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
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
EOF

# Enable site and remove default
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/community-connect /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
print_success "Nginx configured and restarted"

# Configure firewall
print_info "Configuring firewall..."
sudo ufw allow 'Nginx Full' 2>/dev/null || true
sudo ufw allow 22 2>/dev/null || true
print_success "Firewall configured"

# Get server IP
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo ""
echo "=========================================="
print_success "Deployment completed successfully!"
echo "=========================================="
echo ""
echo "Application URLs:"
echo "  Frontend: http://$SERVER_IP"
echo "  Backend:  http://$SERVER_IP/api"
echo ""
echo "PM2 Commands:"
echo "  View logs:    pm2 logs"
echo "  View status:  pm2 status"
echo "  Restart:      pm2 restart all"
echo "  Stop:         pm2 stop all"
echo ""
echo "Nginx Commands:"
echo "  Status:       sudo systemctl status nginx"
echo "  Restart:      sudo systemctl restart nginx"
echo "  Logs:         sudo tail -f /var/log/nginx/error.log"
echo ""
print_info "You can now access the application at: http://$SERVER_IP"
echo ""
