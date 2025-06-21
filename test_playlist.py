#!/usr/bin/env python3
"""
Simple test script to verify YouTube playlist generator functionality
"""

import asyncio
import logging
from dotenv import load_dotenv
import os
import sys

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


async def test_playlist_creation():
    """Test the playlist creation with sample YouTube URLs"""
    
    # Get settings
    settings = get_settings()
    
    # Check if API key is configured
    if not settings.youtube_api_key:
        print("\n❌ ERROR: YouTube API key not configured!")
        print("Please create a .env file with your YouTube API key:")
        print("  cp .env.example .env")
        print("  # Edit .env and add your YOUTUBE_API_KEY")
        return
    
    # Initialize playlist generator
    generator = PlaylistGenerator(
        youtube_api_key=settings.youtube_api_key,
        openai_api_key=settings.openai_api_key if settings.openai_api_key else None
    )
    
    # Test URLs (mix of different YouTube URL formats)
    test_urls = [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  # Rick Astley - Never Gonna Give You Up
        "https://youtu.be/9bZkp7q19f0",                  # PSY - Gangnam Style
        "https://www.youtube.com/watch?v=kXYiU_JCYtU",  # Linkin Park - Numb
        "invalid-url",                                    # Invalid URL to test error handling
        "https://youtube.com/watch?v=invalid123",        # Invalid video ID
    ]
    
    print("\n🎬 YouTube Playlist Generator Test")
    print("=" * 50)
    print(f"\nTesting with {len(test_urls)} URLs...")
    
    # Extract video IDs
    video_ids = generator.extract_video_ids(test_urls)
    print(f"\n✅ Extracted {len(video_ids)} video IDs:")
    for vid_id in video_ids:
        print(f"  - {vid_id}")
    
    # Validate videos
    print("\n🔍 Validating videos...")
    valid_videos, invalid_videos = generator.validate_videos(video_ids)
    
    print(f"\n✅ Valid videos: {len(valid_videos)}")
    for video in valid_videos:
        print(f"  - {video.title} (by {video.channel})")
    
    if invalid_videos:
        print(f"\n❌ Invalid videos: {len(invalid_videos)}")
        for video in invalid_videos:
            print(f"  - {video.video_id}: {video.error}")
    
    # Test AI title generation
    if settings.openai_api_key and valid_videos:
        print("\n🤖 Generating AI title...")
        title = await generator.generate_title(valid_videos)
        print(f"  Generated title: '{title}'")
    else:
        print("\n⚠️  Skipping AI title generation (no OpenAI API key)")
    
    # Create playlist (mock for now)
    print("\n📋 Creating playlist...")
    result = await generator.create_playlist(test_urls)
    
    if result.success:
        print(f"\n✅ Playlist created successfully!")
        print(f"  Title: {result.title}")
        print(f"  URL: {result.playlist_url}")
        print(f"  Videos added: {result.video_count}")
        print(f"\n⚠️  {result.error}")
    else:
        print(f"\n❌ Failed to create playlist: {result.error}")
    
    print("\n" + "=" * 50)
    print("Test complete!")


if __name__ == "__main__":
    asyncio.run(test_playlist_creation())