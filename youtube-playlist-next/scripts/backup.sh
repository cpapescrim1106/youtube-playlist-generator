#!/bin/bash

# Backup script for YouTube Playlist Generator

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${TIMESTAMP}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "🔄 Starting backup process..."

# Backup database
if [ -f "youtube_playlists.db" ]; then
    cp youtube_playlists.db "$BACKUP_DIR/${BACKUP_NAME}_database.db"
    echo "✅ Database backed up"
else
    echo "⚠️  No database found to backup"
fi

# Backup uploads directory
if [ -d "uploads" ]; then
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}_uploads.tar.gz" uploads/
    echo "✅ Uploads directory backed up"
else
    echo "⚠️  No uploads directory found"
fi

# Backup environment variables (without sensitive data)
if [ -f ".env" ]; then
    grep -v "SECRET\|TOKEN\|KEY" .env > "$BACKUP_DIR/${BACKUP_NAME}_env_template.txt"
    echo "✅ Environment template created"
fi

# Create backup manifest
cat > "$BACKUP_DIR/${BACKUP_NAME}_manifest.json" << EOF
{
  "timestamp": "$TIMESTAMP",
  "version": "$(node -p "require('./package.json').version")",
  "files": [
    "${BACKUP_NAME}_database.db",
    "${BACKUP_NAME}_uploads.tar.gz",
    "${BACKUP_NAME}_env_template.txt"
  ]
}
EOF

echo "✨ Backup completed: $BACKUP_DIR/$BACKUP_NAME"