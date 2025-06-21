"""
FastAPI backend for YouTube playlist generator
"""
import os
import logging
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .models import (
    CreatePlaylistRequest,
    ValidateVideosRequest,
    PlaylistResponse,
    ValidateVideosResponse,
    PlaylistHistoryResponse,
    StatsResponse,
    HealthResponse,
    ErrorResponse,
    VideoInfo as VideoInfoModel
)
from .playlist_core import PlaylistGenerator, VideoInfo
from .config import get_settings
from .youtube_auth import YouTubeAuth
from .database import db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="YouTube Playlist Generator API",
    description="Create YouTube playlists with AI-generated titles",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Global settings
settings = get_settings()

# Configure CORS
origins = settings.get_allowed_origins_list()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize playlist generator
playlist_generator = None


def get_playlist_generator():
    """Get or create playlist generator instance"""
    global playlist_generator
    if not playlist_generator:
        use_oauth = os.path.exists('token.pickle')
        playlist_generator = PlaylistGenerator(
            youtube_api_key=settings.youtube_api_key,
            openai_api_key=settings.openai_api_key,
            use_oauth=use_oauth
        )
    return playlist_generator


# Error handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": exc.detail
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    )


# Health check endpoint
@app.get("/api/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Check API health and configuration status"""
    youtube_auth = os.path.exists('token.pickle')
    
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        youtube_auth=youtube_auth,
        openai_configured=bool(settings.openai_api_key and settings.openai_api_key != "your_openai_api_key_here"),
        telegram_configured=bool(settings.telegram_token and settings.telegram_token != "your_telegram_bot_token_here"),
        database_connected=True  # Database is always available (SQLite)
    )


# Version endpoint
@app.get("/api/version", tags=["System"])
async def get_version():
    """Get API version information"""
    return {
        "version": "1.0.0",
        "name": "YouTube Playlist Generator API",
        "description": "Create YouTube playlists with AI-generated titles"
    }


# Create playlist endpoint
@app.post("/api/v1/playlists", response_model=PlaylistResponse, tags=["Playlists"])
async def create_playlist(
    request: CreatePlaylistRequest,
    generator: PlaylistGenerator = Depends(get_playlist_generator)
):
    """Create a new YouTube playlist from video URLs"""
    try:
        logger.info(f"Creating playlist with {len(request.videos)} videos")
        
        # Create playlist
        result = await generator.create_playlist(
            video_urls=request.videos,
            custom_title=request.title,
            description=request.description
        )
        
        if not result.success:
            raise HTTPException(status_code=400, detail=result.error)
        
        # Convert to response model
        response = PlaylistResponse(
            success=result.success,
            playlist_id=result.playlist_id,
            playlist_url=result.playlist_url,
            title=result.title,
            description=result.description,
            video_count=result.video_count,
            videos_added=[
                VideoInfoModel(
                    video_id=v.video_id,
                    title=v.title,
                    channel=v.channel,
                    duration=v.duration,
                    url=f"https://youtube.com/watch?v={v.video_id}",
                    status=v.status,
                    error=v.error
                ) for v in (result.videos_added or [])
            ],
            videos_skipped=[
                VideoInfoModel(
                    video_id=v.video_id,
                    title=v.title,
                    channel=v.channel,
                    duration=v.duration,
                    url=f"https://youtube.com/watch?v={v.video_id}",
                    status=v.status,
                    error=v.error
                ) for v in (result.videos_skipped or [])
            ],
            error=result.error
        )
        
        # TODO: Save to database
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating playlist: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Validate videos endpoint
@app.post("/api/v1/videos/validate", response_model=ValidateVideosResponse, tags=["Videos"])
async def validate_videos(
    request: ValidateVideosRequest,
    generator: PlaylistGenerator = Depends(get_playlist_generator)
):
    """Validate YouTube video URLs before creating playlist"""
    try:
        # Extract video IDs
        video_ids = generator.extract_video_ids(request.videos)
        
        if not video_ids:
            return ValidateVideosResponse(
                success=False,
                total_count=len(request.videos),
                valid_count=0,
                invalid_count=len(request.videos)
            )
        
        # Validate videos
        valid_videos, invalid_videos = generator.validate_videos(video_ids)
        
        # Convert to response model
        return ValidateVideosResponse(
            success=True,
            valid_videos=[
                VideoInfoModel(
                    video_id=v.video_id,
                    title=v.title,
                    channel=v.channel,
                    duration=v.duration,
                    url=f"https://youtube.com/watch?v={v.video_id}",
                    status=v.status,
                    error=v.error
                ) for v in valid_videos
            ],
            invalid_videos=[
                VideoInfoModel(
                    video_id=v.video_id,
                    title=v.title,
                    channel=v.channel,
                    duration=v.duration,
                    url=f"https://youtube.com/watch?v={v.video_id}",
                    status=v.status,
                    error=v.error
                ) for v in invalid_videos
            ],
            total_count=len(valid_videos) + len(invalid_videos),
            valid_count=len(valid_videos),
            invalid_count=len(invalid_videos)
        )
        
    except Exception as e:
        logger.error(f"Error validating videos: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Get playlist history endpoint
@app.get("/api/v1/playlists", response_model=PlaylistHistoryResponse, tags=["Playlists"])
async def get_playlist_history(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=1, le=100, description="Items per page"),
    user_id: Optional[str] = Query(None, description="Filter by user ID")
):
    """Get playlist creation history"""
    try:
        # Get playlists from database
        offset = (page - 1) * per_page
        playlists = db.get_playlist_history(
            user_identifier=user_id,
            limit=per_page,
            offset=offset,
            include_videos=True
        )
        
        # Get total count for pagination
        stats = db.get_statistics(user_identifier=user_id)
        total = stats['total_playlists']
        
        # Convert to response models
        playlist_items = []
        for p in playlists:
            playlist_items.append({
                'id': p['id'],
                'youtube_id': p['youtube_id'],
                'title': p['title'],
                'description': p.get('description'),
                'url': p['url'],
                'video_count': p['video_count'],
                'created_by': p['created_by'],
                'created_at': p['created_at'],
                'videos': [
                    VideoInfoModel(
                        video_id=v['video_id'],
                        title=v['video_title'] or 'Unknown',
                        channel=v['video_channel'] or 'Unknown',
                        duration=v['video_duration'] or 'Unknown',
                        url=f"https://youtube.com/watch?v={v['video_id']}",
                        status='valid'
                    )
                    for v in p.get('videos', [])
                ]
            })
        
        return PlaylistHistoryResponse(
            playlists=playlist_items,
            total=total,
            page=page,
            per_page=per_page,
            has_next=(page * per_page) < total,
            has_prev=page > 1
        )
        
    except Exception as e:
        logger.error(f"Error getting playlist history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Get statistics endpoint
@app.get("/api/v1/stats", response_model=StatsResponse, tags=["Statistics"])
async def get_statistics():
    """Get usage statistics"""
    try:
        stats = db.get_statistics()
        
        # Get API usage counts
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT service, COUNT(*) as count
                FROM api_usage
                GROUP BY service
            ''')
            api_usage = {row['service']: row['count'] for row in cursor.fetchall()}
        
        return StatsResponse(
            total_playlists=stats['total_playlists'],
            total_videos=stats['total_videos'],
            playlists_today=stats['playlists_today'],
            playlists_this_week=0,  # TODO: Add weekly stats
            playlists_this_month=0,  # TODO: Add monthly stats
            most_common_videos=stats['most_common_videos'],
            average_playlist_size=stats['average_playlist_size'],
            api_usage=api_usage
        )
        
    except Exception as e:
        logger.error(f"Error getting statistics: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Root endpoint
@app.get("/", tags=["System"])
async def root():
    """Root endpoint"""
    return {
        "message": "YouTube Playlist Generator API",
        "docs": "/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.api_host, port=settings.api_port)