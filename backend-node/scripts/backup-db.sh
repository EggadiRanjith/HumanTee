#!/bin/bash
# Daily database backup script
# Usage: ./scripts/backup-db.sh

set -e  # Exit on error

DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="./backups"
BACKUP_FILE="$BACKUP_DIR/humantee_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

echo "🔄 Starting database backup..."

# Backup database (uses DATABASE_URL or individual connection params)
if [ -n "$DATABASE_URL" ]; then
    pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
else
    PGPASSWORD="$DB_PASSWORD" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USERNAME" \
        -d "$DB_DATABASE" \
        > "$BACKUP_FILE"
fi

# Compress backup
echo "📦 Compressing backup..."
gzip "$BACKUP_FILE"

echo "✅ Backup completed: $BACKUP_FILE.gz"

# Optional: Upload to S3
if [ -n "$AWS_S3_BUCKET" ]; then
    echo "☁️  Uploading to S3..."
    aws s3 cp "$BACKUP_FILE.gz" "s3://$AWS_S3_BUCKET/backups/"
    echo "✅ Uploaded to S3"
fi

# Delete backups older than 7 days
echo "🗑️  Cleaning old backups (keeping last 7 days)..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete

echo "✨ Backup process complete!"
