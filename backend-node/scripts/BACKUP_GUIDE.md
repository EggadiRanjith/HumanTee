# Database Backup Script

## Daily PostgreSQL Backup

**File**: `backend-node/scripts/backup-db.sh`

```bash
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
```

**Make executable**:
```bash
chmod +x scripts/backup-db.sh
```

**Test backup**:
```bash
# Load environment variables
source .env

# Run backup script
./scripts/backup-db.sh
```

**Add to crontab** (runs daily at 2 AM):
```bash
# Edit crontab
crontab -e

# Add line:
0 2 * * * cd /path/to/backend-node && ./scripts/backup-db.sh >> logs/backup.log 2>&1
```

---

## Restore from Backup

**File**: `backend-node/scripts/restore-db.sh`

```bash
#!/bin/bash
# Restore database from backup
# Usage: ./scripts/restore-db.sh backups/humantee_2024-01-20.sql.gz

set -e

if [ -z "$1" ]; then
    echo "❌ Error: Please provide backup file"
    echo "Usage: ./scripts/restore-db.sh backups/humantee_2024-01-20.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  WARNING: This will REPLACE the current database!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Restore cancelled"
    exit 0
fi

# Extract if gzipped
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "📦 Extracting backup..."
    gunzip -c "$BACKUP_FILE" > "${BACKUP_FILE%.gz}"
    BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

echo "🔄 Restoring database..."

# Restore database
if [ -n "$DATABASE_URL" ]; then
    psql "$DATABASE_URL" < "$BACKUP_FILE"
else
    PGPASSWORD="$DB_PASSWORD" psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USERNAME" \
        -d "$DB_DATABASE" \
        < "$BACKUP_FILE"
fi

echo "✅ Database restored successfully!"
```

**Make executable**:
```bash
chmod +x scripts/restore-db.sh
```

---

## Automated Backups (Render/Railway)

If using Render or Railway, they provide automated backups:

### **Render**:
1. Go to Dashboard → Database → Backups
2. Enable automated daily backups
3. Set retention: 7 days (free) or 30 days (paid)

### **Railway**:
1. Database → Settings → Backups
2. Enable automated backups
3. Configure retention period

### **AWS RDS**:
1. RDS Console → Database → Maintenance & backups
2. Enable automated backups
3. Set backup window (e.g., 2:00 AM)
4. Set retention: 7-30 days

---

## Backup Verification

Create a test restore script:

**File**: `backend-node/scripts/test-backup.sh`

```bash
#!/bin/bash
# Test that backups can be restored

# Get latest backup
LATEST_BACKUP=$(ls -t backups/*.sql.gz | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ No backups found"
    exit 1
fi

echo "Testing restore of: $LATEST_BACKUP"

# Create test database
createdb humantee_test

# Restore to test database
gunzip -c "$LATEST_BACKUP" | psql humantee_test

# Verify tables exist
TABLE_COUNT=$(psql humantee_test -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo "✅ Backup is valid ($TABLE_COUNT tables restored)"
else
    echo "❌ Backup is corrupt (no tables found)"
fi

# Cleanup
dropdb humantee_test
```

---

## Setup Checklist

- [ ] Create `scripts` directory
- [ ] Copy `backup-db.sh` script
- [ ] Copy `restore-db.sh` script
- [ ] Make scripts executable (`chmod +x`)
- [ ] Test backup script
- [ ] Set up cron job OR enable cloud provider backups
- [ ] Test restore process
- [ ] Document backup location in runbook

---

**Estimated Time**: 30 minutes
