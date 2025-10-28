#!/bin/bash

# View logs for Community Connect

echo "Community Connect Logs"
echo "======================"
echo ""
echo "Press Ctrl+C to exit"
echo ""

# Show both backend and frontend logs
pm2 logs community-connect-backend community-connect-frontend
