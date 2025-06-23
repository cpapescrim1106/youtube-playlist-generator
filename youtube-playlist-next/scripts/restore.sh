#!/bin/bash

# Restore script for YouTube Playlist Generator

if [ -z "$1" ]; then
    echo "Usage: ./scripts/restore.sh <backup_timestamp>"
    echo "Available backups:"
    ls -la backups/backup_*/manifest.json 2>/dev/null | awk -F'/' '{print $(NF-1)}'
    exit 1
fi

BACKUP_DIR="./backups"
BACKUP_NAME="backup_$1"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

if [ ! -f "$BACKUP_PATH/manifest.json" ]; then
    echo "❌ Backup not found: $BACKUP_NAME"
    exit 1
fi

echo "🔄 Starting restore process from $BACKUP_NAME..."

# Restore database
if [ -f "$BACKUP_PATH/${BACKUP_NAME}_database.db" ]; then
    cp "$BACKUP_PATH/${BACKUP_NAME}_database.db" youtube_playlists.db
    echo "✅ Database restored"
else
    echo "⚠️  No database backup found"
fi

# Restore uploads
if [ -f "$BACKUP_PATH/${BACKUP_NAME}_uploads.tar.gz" ]; then
    rm -rf uploads
    tar -xzf "$BACKUP_PATH/${BACKUP_NAME}_uploads.tar.gz"
    echo "✅ Uploads directory restored"
else
    echo "⚠️  No uploads backup found"
fi

# Show environment template
if [ -f "$BACKUP_PATH/${BACKUP_NAME}_env_template.txt" ]; then
    echo "📋 Environment template:"
    cat "$BACKUP_PATH/${BACKUP_NAME}_env_template.txt"
    echo ""
    echo "⚠️  Remember to add your secret keys to .env"
fi

echo "✨ Restore completed from $BACKUP_NAME"