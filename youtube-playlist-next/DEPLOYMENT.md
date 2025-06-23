# YouTube Playlist Generator - Deployment Guide

## Prerequisites

- Node.js 20+ installed
- Docker and Docker Compose (for containerized deployment)
- CapRover instance (for CapRover deployment)
- Google OAuth credentials configured
- OpenAI API key
- Telegram Bot token (optional)

## Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Fill in all required environment variables in `.env`

## Local Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Start development server
npm run dev
```

## Production Deployment

### Option 1: Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up -d
```

2. Check logs:
```bash
docker-compose logs -f
```

3. Stop the application:
```bash
docker-compose down
```

### Option 2: CapRover Deployment

1. Ensure your CapRover instance is set up and accessible

2. Install CapRover CLI:
```bash
npm install -g caprover
```

3. Login to CapRover:
```bash
caprover login
```

4. Create a new app in CapRover dashboard

5. Deploy the application:
```bash
caprover deploy
```

6. Set environment variables in CapRover dashboard:
   - Go to your app settings
   - Add all environment variables from `.env.example`
   - Enable HTTPS
   - Set persistent storage for `/app/youtube_playlists.db` and `/app/uploads`

### Option 3: Manual Deployment

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Start the production server:
```bash
npm start
```

## Database Migration

If migrating from the Python/FastAPI version:

1. Copy your existing database:
```bash
cp /path/to/old/youtube_playlists.db ./youtube_playlists.db
```

2. Run migration script:
```bash
npx tsx scripts/migrate-data.ts
```

## Backup and Restore

### Creating Backups

Run the backup script:
```bash
./scripts/backup.sh
```

This creates a timestamped backup in the `backups/` directory.

### Restoring from Backup

```bash
# List available backups
./scripts/restore.sh

# Restore specific backup
./scripts/restore.sh 20240123_120000
```

## Health Monitoring

The application provides a health check endpoint:
```bash
curl http://your-domain.com/api/health
```

## SSL/HTTPS Configuration

### For Docker deployment:
Use a reverse proxy like Nginx or Traefik with Let's Encrypt.

### For CapRover:
Enable HTTPS in the CapRover dashboard (automatic with Let's Encrypt).

## Troubleshooting

### Database Issues
- Ensure the database file has proper permissions
- Check if migrations have been run: `npx prisma migrate status`

### OAuth Issues
- Verify redirect URIs in Google Console match your deployment URL
- Ensure NEXTAUTH_URL is set correctly

### Performance
- Enable production mode: `NODE_ENV=production`
- Use PM2 or similar for process management
- Configure proper caching headers

## Security Considerations

1. Always use HTTPS in production
2. Keep all dependencies updated
3. Use strong NEXTAUTH_SECRET (generate with `openssl rand -hex 32`)
4. Restrict database file permissions
5. Regular backups
6. Monitor logs for suspicious activity

## Monitoring

Consider setting up:
- Application logs aggregation
- Error tracking (e.g., Sentry)
- Uptime monitoring
- Performance monitoring

## Support

For issues or questions:
- Check application logs
- Review error messages in browser console
- Ensure all environment variables are set correctly