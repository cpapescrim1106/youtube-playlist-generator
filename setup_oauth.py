#!/usr/bin/env python3
"""
Setup script for YouTube OAuth2 authentication
"""

import os
import sys
import json
from src.youtube_auth import YouTubeAuth
from src.config import get_settings
from dotenv import load_dotenv

load_dotenv()


def main():
    print("🔐 YouTube OAuth2 Setup")
    print("=" * 50)
    
    settings = get_settings()
    
    # Check if we have client ID and secret in .env
    if not settings.youtube_client_id or settings.youtube_client_id == "your_client_id_here":
        print("\n❌ YouTube OAuth credentials not found in .env file!")
        print("\nTo get OAuth credentials:")
        print("1. Go to https://console.cloud.google.com/")
        print("2. Create or select a project")
        print("3. Enable YouTube Data API v3")
        print("4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID")
        print("5. Application type: Desktop app")
        print("6. Download the credentials JSON")
        print("7. Update your .env file with YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET")
        return
    
    # Create credentials.json from .env values
    auth = YouTubeAuth()
    
    print(f"\n✅ Found OAuth credentials in .env")
    print(f"Client ID: {settings.youtube_client_id[:30]}...")
    
    # Create credentials.json file
    credentials_file = auth.create_credentials_json(
        client_id=settings.youtube_client_id,
        client_secret=settings.youtube_client_secret
    )
    
    print(f"\n✅ Created {credentials_file}")
    
    # Authenticate
    print("\n🌐 Starting OAuth2 authentication flow...")
    print("A browser window will open for you to authorize the application.")
    print("If the browser doesn't open automatically, visit the URL shown below.")
    
    try:
        credentials = auth.authenticate()
        print("\n✅ Authentication successful!")
        print("Token saved to token.pickle")
        
        # Test the authentication
        youtube = auth.get_youtube_service()
        
        # Try to get user's channel info
        request = youtube.channels().list(
            part="snippet",
            mine=True
        )
        response = request.execute()
        
        if response.get('items'):
            channel = response['items'][0]['snippet']
            print(f"\n✅ Connected to YouTube channel: {channel['title']}")
            print(f"Channel ID: {response['items'][0]['id']}")
        
        print("\n✅ OAuth setup complete! You can now create playlists.")
        
    except Exception as e:
        print(f"\n❌ Authentication failed: {e}")
        print("\nPlease check your credentials and try again.")
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())