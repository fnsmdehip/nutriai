#!/bin/bash
# setup-db-backup.sh - Sets up automated database backups

set -e

echo "=== Setting up database backups on 159.223.196.97 ==="

# Create the backup script on the server
ssh root@159.223.196.97 << 'EOT'
mkdir -p /root/backups
mkdir -p /root/scripts

cat > /root/scripts/backup-database.sh << 'EOF'
#!/bin/bash
# Database backup script

# Create timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/root/backups

# Create backup
docker exec riskoptimize_db_1 pg_dump -U user nutridb > $BACKUP_DIR/nutridb_$TIMESTAMP.sql

# Compress backup
gzip $BACKUP_DIR/nutridb_$TIMESTAMP.sql

# Rotate backups (keep last 7 days)
find $BACKUP_DIR -name 'nutridb_*.sql.gz' -type f -mtime +7 -delete

# Log
echo "$(date): Backup completed - nutridb_$TIMESTAMP.sql.gz" >> $BACKUP_DIR/backup.log
EOF

# Make the script executable
chmod +x /root/scripts/backup-database.sh

# Add to crontab - run daily at 2 AM
(crontab -l 2>/dev/null; echo '0 2 * * * /root/scripts/backup-database.sh') | crontab -

echo "Database backup scheduled. Daily backups will run at 2 AM."
echo "Backup files will be stored in /root/backups/"
EOT

echo "=== Database backup setup complete ==="
echo "Daily backups will run at 2 AM on the server." 