# Deployment Instructions for CapRover

## Prerequisites
- CapRover CLI installed (`npm install -g caprover`)
- Access to your CapRover instance
- All environment variables ready

## Deploy to CapRover

1. **Deploy the application:**
   ```bash
   caprover deploy --default
   ```
   
   Or if deploying for the first time:
   ```bash
   caprover deploy \
     --caproverUrl https://captain.srv835477.hstgr.cloud \
     --appName youtube-playlist-creater \
     --branch main
   ```
   
   Enter your CapRover password when prompted.

2. **Configure Environment Variables:**
   
   Go to your CapRover dashboard and set these environment variables for the app:
   
   ```
   YOUTUBE_API_KEY=your_youtube_api_key
   OPENAI_API_KEY=your_openai_api_key
   TELEGRAM_TOKEN=your_telegram_bot_token
   YOUTUBE_CLIENT_ID=your_youtube_client_id
   YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
   ALLOWED_TELEGRAM_USER_ID=your_telegram_user_id
   DATABASE_URL=sqlite:////app/data/playlists.db
   ```

3. **Upload OAuth Credentials:**
   
   You'll need to upload your `credentials.json` and `token.pickle` files:
   
   - Option 1: Use CapRover's "App Configs" → "Persistent Directory" feature
   - Option 2: Build a custom Docker image with these files included
   - Option 3: Use environment variables to store the credentials

4. **Enable HTTPS:**
   
   In CapRover dashboard:
   - Go to your app settings
   - Enable HTTPS
   - Force HTTPS redirect

5. **Access Your Application:**
   
   Your app will be available at:
   - Web UI: `https://youtube-playlist-creater.srv835477.hstgr.cloud`
   - API Docs: `https://youtube-playlist-creater.srv835477.hstgr.cloud/docs`

## Updating the Application

To deploy updates:
```bash
git add .
git commit -m "Your changes"
git push origin main
caprover deploy --default
```

## Monitoring

- Check logs in CapRover dashboard under "App Logs"
- Monitor disk usage for the SQLite database
- Set up monitoring for the Telegram bot status

## Troubleshooting

1. **Build Failures:**
   - Check the CapRover build logs
   - Ensure all files referenced in Dockerfile exist
   - Verify requirements.txt is up to date

2. **Runtime Errors:**
   - Check environment variables are set correctly
   - Verify OAuth credentials are accessible
   - Check database permissions

3. **Telegram Bot Issues:**
   - Ensure webhook URL is accessible
   - Verify bot token is correct
   - Check allowed user ID is set