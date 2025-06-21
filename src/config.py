from pydantic_settings import BaseSettings
from typing import Optional, List
from functools import lru_cache


class Settings(BaseSettings):
    # API Keys
    telegram_token: str = ""
    youtube_api_key: str
    openai_api_key: str = ""
    
    # YouTube OAuth
    youtube_client_id: str = ""
    youtube_client_secret: str = ""
    youtube_redirect_uri: str = "http://localhost:8080"
    
    # API Settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    allowed_origins: str = "http://localhost:3000"
    
    # Telegram Settings
    allowed_telegram_user_id: Optional[str] = None
    
    # Feature Settings
    max_videos_per_playlist: int = 50
    default_playlist_privacy: str = "unlisted"
    enable_ai_titles: bool = True
    
    # Database
    database_url: str = "sqlite:///playlists.db"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

    def get_allowed_telegram_users(self) -> List[int]:
        """Parse comma-separated telegram user IDs"""
        if not self.allowed_telegram_user_id:
            return []
        return [int(uid.strip()) for uid in self.allowed_telegram_user_id.split(",") if uid.strip()]
    
    def get_allowed_origins_list(self) -> List[str]:
        """Parse comma-separated allowed origins"""
        if not self.allowed_origins:
            return []
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


@lru_cache()
def get_settings():
    """Get cached settings instance"""
    return Settings()