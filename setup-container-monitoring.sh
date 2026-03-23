#!/bin/bash
# setup-container-monitoring.sh - Sets up Docker container monitoring for auto-restart

set -e

echo "=== Setting up Docker container monitoring on 159.223.196.97 ==="

# Create the systemd service file
ssh root@159.223.196.97 << 'EOT'
cat > /etc/systemd/system/docker-monitor.service << 'EOF'
[Unit]
Description=Docker Container Monitoring Service
After=docker.service
Requires=docker.service

[Service]
Type=simple
ExecStart=/usr/local/bin/docker-monitor.sh
Restart=always
RestartSec=10s

[Install]
WantedBy=multi-user.target
EOF

# Create the monitoring script
cat > /usr/local/bin/docker-monitor.sh << 'EOF'
#!/bin/bash

# Define log file
LOG_FILE="/var/log/docker-monitor.log"

# Function to log with timestamp
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

log "Docker monitor service started"

# Main monitoring loop
while true; do
    # Check API container
    if ! docker ps | grep -q "riskoptimize_api_1"; then
        log "API container down, attempting restart..."
        cd /root/riskoptimize
        docker-compose up -d api
        log "Restart command executed"
    fi
    
    # Check DB container
    if ! docker ps | grep -q "riskoptimize_db_1"; then
        log "Database container down, attempting restart..."
        cd /root/riskoptimize
        docker-compose up -d db
        log "Restart command executed"
    fi
    
    # Check Redis container
    if ! docker ps | grep -q "riskoptimize_cache_1"; then
        log "Cache container down, attempting restart..."
        cd /root/riskoptimize
        docker-compose up -d cache
        log "Restart command executed"
    fi
    
    # Sleep for 30 seconds before checking again
    sleep 30
done
EOF

# Make the script executable
chmod +x /usr/local/bin/docker-monitor.sh

# Enable and start the service
systemctl daemon-reload
systemctl enable docker-monitor.service
systemctl start docker-monitor.service

# Check service status
systemctl status docker-monitor.service

# Create logrotate configuration for monitor logs
cat > /etc/logrotate.d/docker-monitor << 'EOF'
/var/log/docker-monitor.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 root root
}
EOF

echo "Docker container monitoring setup complete. Logs at /var/log/docker-monitor.log"
EOT

echo "=== Monitoring setup complete ==="
echo "Docker containers will be automatically monitored and restarted if they fail." 