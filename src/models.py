"""
Pydantic models for API requests and responses
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, validator


# Request Models
class CreatePlaylistRequest(BaseModel):
    videos: List[str] = Field(..., description="List of YouTube video URLs", min_items=1, max_items=50)
    title: Optional[str] = Field(None, description="Custom playlist title", max_length=100)
    description: Optional[str] = Field(None, description="Custom playlist description", max_length=5000)
    privacy: str = Field("unlisted", description="Playlist privacy setting", pattern="^(public|unlisted|private)$")
    
    @validator('videos')
    def validate_urls(cls, urls):
        """Basic validation that URLs look like YouTube URLs"""
        youtube_domains = ['youtube.com', 'youtu.be', 'm.youtube.com']
        for url in urls:
            if not any(domain in url.lower() for domain in youtube_domains):
                raise ValueError(f"Invalid YouTube URL: {url}")
        return urls


class ValidateVideosRequest(BaseModel):
    videos: List[str] = Field(..., description="List of YouTube video URLs to validate", min_items=1, max_items=50)


# Response Models
class VideoInfo(BaseModel):
    video_id: str
    title: str
    channel: str
    duration: str
    url: str
    status: str = "valid"
    error: Optional[str] = None


class PlaylistResponse(BaseModel):
    success: bool
    playlist_id: Optional[str] = None
    playlist_url: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    video_count: int = 0
    videos_added: List[VideoInfo] = []
    videos_skipped: List[VideoInfo] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    error: Optional[str] = None


class ValidateVideosResponse(BaseModel):
    success: bool
    valid_videos: List[VideoInfo] = []
    invalid_videos: List[VideoInfo] = []
    total_count: int
    valid_count: int
    invalid_count: int


class PlaylistHistoryItem(BaseModel):
    id: str
    youtube_id: str
    title: str
    description: Optional[str]
    url: str
    video_count: int
    created_by: str
    created_at: datetime
    videos: Optional[List[VideoInfo]] = None


class PlaylistHistoryResponse(BaseModel):
    playlists: List[PlaylistHistoryItem]
    total: int
    page: int
    per_page: int
    has_next: bool
    has_prev: bool


class StatsResponse(BaseModel):
    total_playlists: int
    total_videos: int
    playlists_today: int
    playlists_this_week: int
    playlists_this_month: int
    most_common_videos: List[Dict[str, Any]]
    average_playlist_size: float
    api_usage: Dict[str, int]


class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "1.0.0"
    youtube_auth: bool
    openai_configured: bool
    telegram_configured: bool
    database_connected: bool
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ErrorResponse(BaseModel):
    success: bool = False
    error: Dict[str, str]
    timestamp: datetime = Field(default_factory=datetime.utcnow)