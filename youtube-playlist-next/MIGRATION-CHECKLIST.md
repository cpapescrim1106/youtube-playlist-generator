# Migration Checklist - Python to Next.js

## Pre-Migration

- [ ] **Backup Current System**
  - [ ] Run backup script on Python app: `python scripts/backup.py`
  - [ ] Download database file: `youtube_playlists.db`
  - [ ] Export environment variables (without secrets)
  - [ ] Document current OAuth redirect URIs

- [ ] **Verify Requirements**
  - [ ] Node.js 20+ installed
  - [ ] Access to Google Cloud Console
  - [ ] OpenAI API key ready
  - [ ] Telegram bot token (if using)

## Migration Steps

### 1. Environment Setup

- [ ] Clone Next.js repository
- [ ] Copy `.env.example` to `.env`
- [ ] Configure environment variables:
  - [ ] `DATABASE_URL` - Point to SQLite file
  - [ ] `NEXTAUTH_URL` - Set production URL
  - [ ] `NEXTAUTH_SECRET` - Generate with `openssl rand -hex 32`
  - [ ] `YOUTUBE_CLIENT_ID` - From Google Console
  - [ ] `YOUTUBE_CLIENT_SECRET` - From Google Console
  - [ ] `OPENAI_API_KEY` - Your OpenAI key
  - [ ] `TELEGRAM_BOT_TOKEN` - If using Telegram

### 2. OAuth Configuration

- [ ] Update Google OAuth consent screen
- [ ] Add new redirect URIs:
  - [ ] `https://your-domain.com/api/auth/callback/google`
  - [ ] `http://localhost:8080/api/auth/callback/google` (for testing)
- [ ] Verify authorized domains

### 3. Database Migration

- [ ] Copy database file to Next.js project
- [ ] Run migration script:
  ```bash
  npx tsx scripts/migrate-data.ts
  ```
- [ ] Verify data integrity:
  ```bash
  npx prisma studio
  ```

### 4. Local Testing

- [ ] Install dependencies: `npm install`
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Start development server: `npm run dev`
- [ ] Test core functionality:
  - [ ] OAuth login/logout
  - [ ] Create playlist with videos
  - [ ] View playlist history
  - [ ] Check statistics
  - [ ] Test Telegram bot (if applicable)

### 5. Production Deployment

- [ ] Build application: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Deploy using chosen method:
  - [ ] Docker: `docker-compose up -d`
  - [ ] CapRover: `caprover deploy`
  - [ ] Manual: Follow deployment guide

### 6. DNS & SSL

- [ ] Update DNS records to point to new server
- [ ] Configure SSL certificate:
  - [ ] CapRover: Enable in dashboard
  - [ ] Manual: Use Let's Encrypt with nginx

### 7. Post-Migration Verification

- [ ] **Functionality Tests**
  - [ ] User can log in with Google
  - [ ] Playlist creation works
  - [ ] AI title generation works
  - [ ] History displays correctly
  - [ ] Statistics are accurate
  - [ ] Telegram bot responds (if applicable)

- [ ] **Data Verification**
  - [ ] All playlists migrated
  - [ ] Video counts match
  - [ ] User associations preserved
  - [ ] Timestamps correct

- [ ] **Performance Checks**
  - [ ] Page load times acceptable
  - [ ] API response times normal
  - [ ] No memory leaks
  - [ ] Database queries efficient

### 8. Monitoring Setup

- [ ] Configure health check monitoring
- [ ] Set up error tracking (optional)
- [ ] Enable access logs
- [ ] Test backup/restore scripts

### 9. Cutover

- [ ] Schedule maintenance window
- [ ] Stop Python application
- [ ] Final database backup
- [ ] Switch DNS/proxy to Next.js app
- [ ] Monitor for issues

### 10. Cleanup

- [ ] Archive Python application code
- [ ] Remove old OAuth redirect URIs (after 30 days)
- [ ] Update documentation
- [ ] Notify users of any changes

## Rollback Plan

If issues arise:

1. [ ] Stop Next.js application
2. [ ] Restore Python app database
3. [ ] Start Python application
4. [ ] Revert DNS/proxy changes
5. [ ] Investigate and fix issues

## Common Issues & Solutions

### OAuth Errors
- **Issue**: "redirect_uri_mismatch"
- **Solution**: Ensure OAuth redirect URIs match exactly

### Database Errors
- **Issue**: "Database is locked"
- **Solution**: Ensure only one process accesses SQLite

### Missing Playlists
- **Issue**: Playlists not showing
- **Solution**: Check userId migration, may need to update records

### Performance Issues
- **Issue**: Slow page loads
- **Solution**: Enable production mode, check for missing indexes

## Support Contacts

- Technical issues: Create GitHub issue
- Urgent problems: Check deployment logs first
- Database corruption: Use backup/restore scripts

## Sign-off

- [ ] Migration completed successfully
- [ ] All tests passed
- [ ] Stakeholders notified
- [ ] Documentation updated
- [ ] Monitoring active

**Migration Date**: _______________
**Completed By**: _______________
**Verified By**: _______________