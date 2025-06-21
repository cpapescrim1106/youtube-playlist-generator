#!/usr/bin/env python3
"""
Test the FastAPI backend
"""
import sys
import os

# Add src to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    import uvicorn
    from src.api import app
    from src.config import get_settings
    
    settings = get_settings()
    
    print("🚀 Starting YouTube Playlist Generator API...")
    print(f"📍 URL: http://{settings.api_host}:{settings.api_port}")
    print(f"📚 Docs: http://{settings.api_host}:{settings.api_port}/docs")
    print(f"📖 ReDoc: http://{settings.api_host}:{settings.api_port}/redoc")
    print("\nPress Ctrl+C to stop\n")
    
    try:
        uvicorn.run(
            "src.api:app",
            host=settings.api_host,
            port=settings.api_port,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n\n👋 API stopped.")