#!/usr/bin/env python3
"""
Quick test to create a playlist without Telegram
"""
import asyncio
import sys
import os
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.playlist_core import PlaylistGenerator
from src.config import get_settings

load_dotenv()


async def quick_test():
    print("🎬 Quick Playlist Creation Test")
    print("=" * 50)
    
    settings = get_settings()
    
    # Initialize generator
    generator = PlaylistGenerator(
        youtube_api_key=settings.youtube_api_key,
        openai_api_key=settings.openai_api_key,
        use_oauth=True
    )
    
    # Test URLs
    urls = [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://youtu.be/9bZkp7q19f0"
    ]
    
    print(f"\nCreating playlist with {len(urls)} videos...")
    
    result = await generator.create_playlist(
        video_urls=urls,
        custom_title="Quick Test Playlist",
        description="Testing the system"
    )
    
    if result.success:
        print(f"\n✅ Success!")
        print(f"Title: {result.title}")
        print(f"URL: {result.playlist_url}")
        print(f"\nClick here to view: {result.playlist_url}")
    else:
        print(f"\n❌ Failed: {result.error}")


if __name__ == "__main__":
    asyncio.run(quick_test())