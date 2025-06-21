#!/usr/bin/env python3
"""
Test script for YouTube playlist generator with OAuth support
"""

import asyncio
import logging
import os
import sys
from dotenv import load_dotenv

# Add src to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.playlist_core import PlaylistGenerator
from src.config import get_settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Load environment variables
load_dotenv()


async def test_playlist_creation_with_oauth():
    """Test playlist creation with OAuth authentication"""
    
    settings = get_settings()
    
    # Check if OAuth is set up
    use_oauth = os.path.exists('token.pickle')
    
    if not use_oauth:
        print("\n⚠️  OAuth not set up. Run 'python setup_oauth.py' first to enable actual playlist creation.")
        print("Running in mock mode...\n")
    else:
        print("\n✅ OAuth authentication found. Will create actual playlists!\n")
    
    # Initialize playlist generator
    generator = PlaylistGenerator(
        youtube_api_key=settings.youtube_api_key,
        openai_api_key=settings.openai_api_key if settings.openai_api_key else None,
        use_oauth=use_oauth
    )
    
    # Test URLs
    test_urls = [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  # Rick Astley
        "https://youtu.be/9bZkp7q19f0",                  # PSY - Gangnam Style
        "https://www.youtube.com/watch?v=kXYiU_JCYtU",  # Linkin Park - Numb
        "https://www.youtube.com/watch?v=hTWKbfoikeg",  # Nirvana - Smells Like Teen Spirit
        "https://youtube.com/watch?v=fJ9rUzIMcZQ",      # Queen - Bohemian Rhapsody
    ]
    
    print("🎬 YouTube Playlist Generator Test (OAuth Mode)")
    print("=" * 50)
    print(f"\nCreating playlist with {len(test_urls)} videos...")
    
    # Create playlist
    result = await generator.create_playlist(
        video_urls=test_urls,
        custom_title=None,  # Let AI generate the title
        description="Test playlist created by YouTube Playlist Generator"
    )
    
    if result.success:
        print(f"\n✅ Playlist created successfully!")
        print(f"  Title: {result.title}")
        print(f"  URL: {result.playlist_url}")
        print(f"  Playlist ID: {result.playlist_id}")
        print(f"  Videos added: {result.video_count}")
        
        if result.videos_added:
            print("\n📹 Videos in playlist:")
            for i, video in enumerate(result.videos_added, 1):
                print(f"  {i}. {video.title}")
        
        if result.videos_skipped:
            print(f"\n⚠️  Videos skipped: {len(result.videos_skipped)}")
            for video in result.videos_skipped:
                print(f"  - {video.video_id}: {video.error}")
        
        if result.error:
            print(f"\n⚠️  Note: {result.error}")
    else:
        print(f"\n❌ Failed to create playlist: {result.error}")
    
    print("\n" + "=" * 50)
    print("Test complete!")


if __name__ == "__main__":
    asyncio.run(test_playlist_creation_with_oauth())