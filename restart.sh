#!/bin/bash

# Quick restart script for Community Connect

echo "Restarting Community Connect..."

# Restart PM2 processes
pm2 restart community-connect-backend
pm2 restart community-connect-frontend

# Restart Nginx
sudo systemctl restart nginx

echo "✓ All services restarted"
pm2 status
