#!/usr/bin/env python3
"""
Test database functionality
"""
import sys
import os
import asyncio
from datetime import datetime

# Add src to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.database import PlaylistDatabase
from src.playlist_core import PlaylistGenerator
from src.config import get_settings


async def test_database():
    """Test database operations"""
    print("🗄️  Testing Database Integration")
    print("=" * 50)
    
    # Initialize database
    db = PlaylistDatabase("test_playlists.db")
    
    # Test 1: Save a playlist
    print("\n1. Testing playlist save...")
    try:
        success = db.save_playlist(
            playlist_id="test-123",
            youtube_id="PLtest123",
            title="Test Playlist",
            url="https://youtube.com/playlist?list=PLtest123",
            video_count=3,
            created_by="test",
            user_identifier="test_user",
            description="Test description",
            videos=[
                {
                    'video_id': 'abc123',
                    'title': 'Test Video 1',
                    'channel': 'Test Channel',
                    'duration': 'PT3M45S'
                },
                {
                    'video_id': 'def456',
                    'title': 'Test Video 2',
                    'channel': 'Test Channel',
                    'duration': 'PT5M20S'
                }
            ]
        )
        print(f"✅ Playlist saved: {success}")
    except Exception as e:
        print(f"❌ Failed to save playlist: {e}")
    
    # Test 2: Get playlist history
    print("\n2. Testing playlist history...")
    try:
        history = db.get_playlist_history(include_videos=True)
        print(f"✅ Found {len(history)} playlists")
        for playlist in history[:2]:  # Show first 2
            print(f"   - {playlist['title']} ({playlist['video_count']} videos)")
    except Exception as e:
        print(f"❌ Failed to get history: {e}")
    
    # Test 3: Get statistics
    print("\n3. Testing statistics...")
    try:
        stats = db.get_statistics()
        print(f"✅ Statistics:")
        print(f"   - Total playlists: {stats['total_playlists']}")
        print(f"   - Total videos: {stats['total_videos']}")
        print(f"   - Average playlist size: {stats['average_playlist_size']}")
    except Exception as e:
        print(f"❌ Failed to get statistics: {e}")
    
    # Test 4: Create a real playlist with database
    print("\n4. Testing real playlist creation with database...")
    settings = get_settings()
    
    if os.path.exists('token.pickle'):
        try:
            generator = PlaylistGenerator(
                youtube_api_key=settings.youtube_api_key,
                openai_api_key=settings.openai_api_key,
                use_oauth=True
            )
            
            test_urls = [
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "https://youtu.be/9bZkp7q19f0"
            ]
            
            result = await generator.create_playlist(
                video_urls=test_urls,
                custom_title="Database Test Playlist",
                description="Testing database integration"
            )
            
            if result.success:
                print(f"✅ Playlist created and saved to database!")
                print(f"   - Title: {result.title}")
                print(f"   - URL: {result.playlist_url}")
                
                # Check if it was saved
                history = db.get_playlist_history(limit=1)
                if history:
                    print(f"✅ Verified in database: {history[0]['title']}")
            else:
                print(f"❌ Playlist creation failed: {result.error}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    else:
        print("⚠️  OAuth not configured, skipping real playlist test")
    
    print("\n" + "=" * 50)
    print("✅ Database tests complete!")
    
    # Clean up test database
    if os.path.exists("test_playlists.db"):
        os.remove("test_playlists.db")
        print("\n🧹 Cleaned up test database")


if __name__ == "__main__":
    asyncio.run(test_database())