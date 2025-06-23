#!/bin/bash

# CapRover deployment script
echo "Deploying YouTube Playlist Generator to CapRover..."

# Set variables
CAPROVER_URL="https://captain.srv835477.hstgr.cloud"
APP_NAME="youtube-playlist-generator"

# Deploy using CapRover CLI
caprover deploy \
  --caproverUrl "$CAPROVER_URL" \
  --appName "$APP_NAME" \
  --branch main

echo "Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Visit CapRover dashboard at $CAPROVER_URL"
echo "2. Configure environment variables in the app settings:"
echo "   - YOUTUBE_API_KEY"
echo "   - OPENAI_API_KEY"
echo "   - TELEGRAM_TOKEN"
echo "   - YOUTUBE_CLIENT_ID"
echo "   - YOUTUBE_CLIENT_SECRET"
echo "   - ALLOWED_TELEGRAM_USER_ID"
echo "3. Upload credentials.json and token.pickle files"
echo "4. Enable HTTPS for the app"
echo "5. Access your app at https://$APP_NAME.srv835477.hstgr.cloud"