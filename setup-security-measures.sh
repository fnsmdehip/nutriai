#!/bin/bash
# setup-security-measures.sh - Implements basic security for the deployment

set -e

echo "=== Setting up security measures on 159.223.196.97 ==="

# Connect to the server and implement security measures
ssh root@159.223.196.97 << 'EOT'
# Update system packages
apt update
apt upgrade -y

# Install security essentials
apt install -y fail2ban ufw

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 3001/tcp  # API port
ufw allow 5432/tcp  # PostgreSQL (only needed if external access required)
ufw allow 6379/tcp  # Redis (only needed if external access required)
ufw --force enable

# Configure fail2ban for SSH protection
cat > /etc/fail2ban/jail.local << 'EOF'
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 5
findtime = 600
bantime = 3600
EOF

# Restart fail2ban
systemctl restart fail2ban

# Set up log monitoring for unauthorized access attempts
cat > /root/scripts/security-monitor.sh << 'EOF'
#!/bin/bash

# Log file
LOG_FILE="/var/log/security-monitor.log"

# Function to log with timestamp
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Check for failed login attempts
FAILED_SSH=$(grep "Failed password" /var/log/auth.log | wc -l)
if [ $FAILED_SSH -gt 10 ]; then
    log "WARNING: High number of failed SSH attempts: $FAILED_SSH"
fi

# Check for unusual network activity
UNUSUAL_CONNECTIONS=$(netstat -antp | grep -v ESTABLISHED | grep -v LISTEN | wc -l)
if [ $UNUSUAL_CONNECTIONS -gt 100 ]; then
    log "WARNING: Unusual number of network connections: $UNUSUAL_CONNECTIONS"
fi

# Check Docker container status
if ! docker ps | grep -q "riskoptimize_api_1"; then
    log "CRITICAL: API container not running!"
fi

# Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 85 ]; then
    log "WARNING: High disk usage: ${DISK_USAGE}%"
fi

# Check memory usage
MEM_USAGE=$(free | grep Mem | awk '{print $3/$2 * 100.0}' | cut -d. -f1)
if [ $MEM_USAGE -gt 90 ]; then
    log "WARNING: High memory usage: ${MEM_USAGE}%"
fi
EOF

chmod +x /root/scripts/security-monitor.sh

# Add to crontab - run every hour
(crontab -l 2>/dev/null; echo '0 * * * * /root/scripts/security-monitor.sh') | crontab -

# Create logrotate configuration for security logs
cat > /etc/logrotate.d/security-monitor << 'EOF'
/var/log/security-monitor.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 root root
}
EOF

echo "Security measures implemented successfully."
EOT

echo "=== Security setup complete ==="
echo "Basic security measures have been implemented on the server." 