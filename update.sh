#!/bin/bash

# Update and redeploy Community Connect

echo "Updating Community Connect..."

# Get current directory
DEPLOY_DIR=$(pwd)

# Pull latest changes (if using git)
if [ -d .git ]; then
    echo "Pulling latest changes..."
    git pull
fi

# Update backend
echo "Updating backend..."
cd "$DEPLOY_DIR/backend"
npm install --production

# Update frontend
echo "Updating frontend..."
cd "$DEPLOY_DIR/frontend"
npm install
npm run build

# Restart services
echo "Restarting services..."
pm2 restart community-connect-backend
pm2 restart community-connect-frontend

# Save PM2 config
pm2 save

echo "✓ Update completed"
pm2 status
