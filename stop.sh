#!/bin/bash

# Stop all Community Connect services

echo "Stopping Community Connect..."

# Stop PM2 processes
pm2 stop community-connect-backend
pm2 stop community-connect-frontend

echo "✓ Services stopped"
pm2 status
