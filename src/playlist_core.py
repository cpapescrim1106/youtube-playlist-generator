import re
import logging
from typing import List, Optional, Dict, Tuple
from dataclasses import dataclass
from urllib.parse import urlparse, parse_qs

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import openai

from .config import get_settings
from .youtube_auth import YouTubeAuth
from .database import db

logger = logging.getLogger(__name__)


@dataclass
class VideoInfo:
    video_id: str
    title: str
    channel: str
    duration: str
    status: str = "valid"
    error: Optional[str] = None


@dataclass
class PlaylistResult:
    success: bool
    playlist_id: Optional[str] = None
    playlist_url: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    video_count: int = 0
    videos_added: List[VideoInfo] = None
    videos_skipped: List[VideoInfo] = None
    error: Optional[str] = None


class PlaylistGenerator:
    def __init__(self, youtube_api_key: str, openai_api_key: Optional[str] = None, use_oauth: bool = False):
        self.settings = get_settings()
        self.use_oauth = use_oauth
        
        if use_oauth:
            # Use OAuth for full YouTube functionality
            self.youtube_auth = YouTubeAuth()
            self.youtube = self.youtube_auth.get_youtube_service()
        else:
            # Use API key for read-only operations
            self.youtube = build('youtube', 'v3', developerKey=youtube_api_key)
        
        if openai_api_key and self.settings.enable_ai_titles:
            openai.api_key = openai_api_key
            self.openai_client = openai
        else:
            self.openai_client = None

    def extract_video_ids(self, urls: List[str]) -> List[str]:
        """Extract YouTube video IDs from various URL formats"""
        video_ids = []
        
        patterns = [
            r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/shorts/|youtube\.com/embed/)([\w-]+)',
            r'youtube\.com/.*[?&]v=([\w-]+)',
        ]
        
        for url in urls:
            video_id = None
            url = url.strip()
            
            # Try each pattern
            for pattern in patterns:
                match = re.search(pattern, url)
                if match:
                    video_id = match.group(1)
                    break
            
            # Fallback: parse query parameters
            if not video_id:
                parsed = urlparse(url)
                if parsed.netloc in ['www.youtube.com', 'youtube.com', 'm.youtube.com']:
                    query_params = parse_qs(parsed.query)
                    video_id = query_params.get('v', [None])[0]
            
            if video_id and video_id not in video_ids:
                video_ids.append(video_id)
                logger.info(f"Extracted video ID: {video_id}")
        
        return video_ids

    def validate_videos(self, video_ids: List[str]) -> Tuple[List[VideoInfo], List[VideoInfo]]:
        """Validate videos exist and are accessible"""
        valid_videos = []
        invalid_videos = []
        
        # YouTube API allows up to 50 video IDs per request
        for i in range(0, len(video_ids), 50):
            batch_ids = video_ids[i:i + 50]
            
            try:
                response = self.youtube.videos().list(
                    part='snippet,status,contentDetails',
                    id=','.join(batch_ids)
                ).execute()
                
                found_ids = {item['id'] for item in response.get('items', [])}
                
                # Process found videos
                for item in response.get('items', []):
                    video_info = VideoInfo(
                        video_id=item['id'],
                        title=item['snippet']['title'],
                        channel=item['snippet']['channelTitle'],
                        duration=item['contentDetails']['duration']
                    )
                    
                    # Check if video is playable
                    if item['status']['privacyStatus'] == 'private':
                        video_info.status = 'invalid'
                        video_info.error = 'Video is private'
                        invalid_videos.append(video_info)
                    elif item['status'].get('embeddable') == False:
                        video_info.status = 'invalid'
                        video_info.error = 'Video is not embeddable'
                        invalid_videos.append(video_info)
                    else:
                        valid_videos.append(video_info)
                
                # Process not found videos
                for video_id in batch_ids:
                    if video_id not in found_ids:
                        invalid_videos.append(VideoInfo(
                            video_id=video_id,
                            title="Unknown",
                            channel="Unknown",
                            duration="Unknown",
                            status='invalid',
                            error='Video not found'
                        ))
                
            except HttpError as e:
                logger.error(f"YouTube API error: {e}")
                for video_id in batch_ids:
                    invalid_videos.append(VideoInfo(
                        video_id=video_id,
                        title="Unknown",
                        channel="Unknown",
                        duration="Unknown",
                        status='invalid',
                        error=f'API error: {str(e)}'
                    ))
        
        return valid_videos, invalid_videos

    async def generate_title(self, videos: List[VideoInfo]) -> str:
        """Generate a creative playlist title using AI"""
        if not self.openai_client or not videos:
            return "My YouTube Playlist"
        
        # Prepare video list for prompt
        video_list = "\n".join([f"{i+1}. {v.title}" for i, v in enumerate(videos[:10])])
        
        prompt = f"""Given these YouTube videos:
{video_list}

Generate a creative, concise playlist title (max 60 characters) that captures the theme of these videos. 
Return only the title, nothing else."""
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=50,
                temperature=0.7
            )
            
            title = response.choices[0].message.content.strip()
            # Ensure title is not too long
            if len(title) > 60:
                title = title[:57] + "..."
            
            return title
            
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return f"My Collection ({len(videos)} videos)"

    def create_youtube_playlist(
        self, 
        title: str, 
        description: str, 
        privacy: str = "unlisted"
    ) -> Optional[Dict]:
        """Create a YouTube playlist (requires OAuth)"""
        if not self.use_oauth:
            raise ValueError("OAuth authentication required to create playlists")
        
        try:
            request_body = {
                'snippet': {
                    'title': title,
                    'description': description,
                    'defaultLanguage': 'en'
                },
                'status': {
                    'privacyStatus': privacy
                }
            }
            
            response = self.youtube.playlists().insert(
                part='snippet,status',
                body=request_body
            ).execute()
            
            logger.info(f"Created playlist: {response['id']}")
            return response
            
        except HttpError as e:
            logger.error(f"Failed to create playlist: {e}")
            raise
    
    def add_videos_to_playlist(
        self,
        playlist_id: str,
        video_ids: List[str]
    ) -> List[Dict]:
        """Add videos to a playlist (requires OAuth)"""
        if not self.use_oauth:
            raise ValueError("OAuth authentication required to modify playlists")
        
        results = []
        for position, video_id in enumerate(video_ids):
            try:
                request_body = {
                    'snippet': {
                        'playlistId': playlist_id,
                        'resourceId': {
                            'kind': 'youtube#video',
                            'videoId': video_id
                        },
                        'position': position
                    }
                }
                
                response = self.youtube.playlistItems().insert(
                    part='snippet',
                    body=request_body
                ).execute()
                
                results.append({
                    'video_id': video_id,
                    'success': True,
                    'response': response
                })
                logger.info(f"Added video {video_id} to playlist")
                
            except HttpError as e:
                logger.error(f"Failed to add video {video_id}: {e}")
                results.append({
                    'video_id': video_id,
                    'success': False,
                    'error': str(e)
                })
        
        return results

    async def create_playlist(
        self,
        video_urls: List[str],
        custom_title: Optional[str] = None,
        description: Optional[str] = None
    ) -> PlaylistResult:
        """Main function to create a playlist from YouTube URLs"""
        
        # Extract video IDs
        video_ids = self.extract_video_ids(video_urls)
        
        if not video_ids:
            return PlaylistResult(
                success=False,
                error="No valid YouTube URLs found"
            )
        
        # Validate videos
        valid_videos, invalid_videos = self.validate_videos(video_ids)
        
        if not valid_videos:
            return PlaylistResult(
                success=False,
                error="No valid videos found",
                videos_skipped=invalid_videos
            )
        
        # Generate title if not provided
        if not custom_title:
            title = await self.generate_title(valid_videos)
        else:
            title = custom_title
        
        # Generate description
        if not description:
            description = f"Playlist with {len(valid_videos)} videos created by YouTube Playlist Generator"
        
        # Create the playlist if OAuth is enabled
        if self.use_oauth:
            try:
                # Create the playlist
                playlist_response = self.create_youtube_playlist(
                    title=title,
                    description=description,
                    privacy=self.settings.default_playlist_privacy
                )
                
                playlist_id = playlist_response['id']
                
                # Add videos to the playlist
                add_results = self.add_videos_to_playlist(
                    playlist_id=playlist_id,
                    video_ids=[v.video_id for v in valid_videos]
                )
                
                # Count successful additions
                successful_adds = sum(1 for r in add_results if r['success'])
                
                # Save to database
                try:
                    import uuid
                    playlist_uuid = str(uuid.uuid4())
                    
                    videos_data = [
                        {
                            'video_id': v.video_id,
                            'title': v.title,
                            'channel': v.channel,
                            'duration': v.duration
                        }
                        for v in valid_videos
                    ]
                    
                    db.save_playlist(
                        playlist_id=playlist_uuid,
                        youtube_id=playlist_id,
                        title=title,
                        url=f"https://youtube.com/playlist?list={playlist_id}",
                        video_count=successful_adds,
                        created_by="api",
                        description=description,
                        videos=videos_data
                    )
                    
                    # Log API usage
                    db.log_api_usage("youtube", "create_playlist")
                    if self.openai_client and not custom_title:
                        db.log_api_usage("openai", "generate_title")
                        
                except Exception as e:
                    logger.error(f"Failed to save playlist to database: {e}")
                
                return PlaylistResult(
                    success=True,
                    playlist_id=playlist_id,
                    playlist_url=f"https://youtube.com/playlist?list={playlist_id}",
                    title=title,
                    description=description,
                    video_count=successful_adds,
                    videos_added=valid_videos,
                    videos_skipped=invalid_videos
                )
                
            except Exception as e:
                logger.error(f"Failed to create playlist: {e}")
                return PlaylistResult(
                    success=False,
                    error=f"Failed to create playlist: {str(e)}",
                    videos_skipped=invalid_videos
                )
        else:
            # Return mock result for non-OAuth mode
            logger.info(f"Would create playlist: {title} with {len(valid_videos)} videos")
            
            return PlaylistResult(
                success=True,
                playlist_id="MOCK_PLAYLIST_ID",
                playlist_url="https://youtube.com/playlist?list=MOCK_PLAYLIST_ID",
                title=title,
                description=description,
                video_count=len(valid_videos),
                videos_added=valid_videos,
                videos_skipped=invalid_videos,
                error="Note: This is a mock result. Enable OAuth to actually create playlists."
            )