#!/bin/bash
# fix-deployment.sh - Direct troubleshooting script for backend deployment

set -e

# Confirm execution
echo "Fixing deployment on 159.223.196.97..."

# Verify local package files are valid
echo "=== STEP 1: Verifying local package files ==="
cd ./backend
npm ls --json > /dev/null || (echo "Local package dependencies have issues, fixing..." && npm install)

# Clean and copy files to server
echo "=== STEP 2: Synchronizing with remote server ==="
rsync -avz --exclude node_modules --exclude dist ./ root@159.223.196.97:/root/riskoptimize/

# SSH into server and perform cleanup
echo "=== STEP 3: Cleaning Docker environment on server ==="
ssh root@159.223.196.97 << 'EOF'
cd /root/riskoptimize
echo "Current directory: $(pwd)"

# Stop and remove all containers
echo "Stopping all containers..."
docker-compose down
docker rm -f $(docker ps -aq) 2>/dev/null || true

# Clean build cache
echo "Cleaning Docker build cache..."
docker builder prune -f
docker system prune -f

# Verify package files exist and are valid
echo "Checking package files..."
ls -la
file package.json package-lock.json
cat package.json | grep version
cat package-lock.json | grep version | head -n 5

# Rebuild image from scratch
echo "Rebuilding Docker images..."
docker-compose build --no-cache api

# Start services
echo "Starting services..."
docker-compose up -d

# Check logs
echo "Container logs:"
sleep 5
docker-compose logs api
EOF

echo "=== Deployment fix complete ==="
echo "Check logs for any remaining issues" 