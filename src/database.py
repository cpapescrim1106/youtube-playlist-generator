"""
SQLite database interface for playlist history
"""
import sqlite3
import json
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any
from contextlib import contextmanager
from pathlib import Path

logger = logging.getLogger(__name__)


class PlaylistDatabase:
    def __init__(self, db_path: str = "playlists.db"):
        self.db_path = db_path
        self._init_database()
    
    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    def _init_database(self):
        """Initialize database tables"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Create playlists table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS playlists (
                    id TEXT PRIMARY KEY,
                    youtube_id TEXT UNIQUE NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT,
                    url TEXT NOT NULL,
                    video_count INTEGER NOT NULL,
                    created_by TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    user_identifier TEXT,
                    metadata TEXT
                )
            ''')
            
            # Create playlist_videos table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS playlist_videos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    playlist_id TEXT NOT NULL,
                    video_id TEXT NOT NULL,
                    video_title TEXT,
                    video_channel TEXT,
                    video_duration TEXT,
                    position INTEGER NOT NULL,
                    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (playlist_id) REFERENCES playlists(id)
                )
            ''')
            
            # Create api_usage table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS api_usage (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    service TEXT NOT NULL,
                    operation TEXT NOT NULL,
                    tokens_used INTEGER,
                    cost_estimate REAL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Create indexes
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_playlists_created_at ON playlists(created_at)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_playlists_user ON playlists(user_identifier)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_playlist_videos_playlist ON playlist_videos(playlist_id)')
            
            logger.info("Database initialized successfully")
    
    def save_playlist(
        self,
        playlist_id: str,
        youtube_id: str,
        title: str,
        url: str,
        video_count: int,
        created_by: str = "api",
        user_identifier: Optional[str] = None,
        description: Optional[str] = None,
        videos: Optional[List[Dict[str, Any]]] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Save a playlist to the database"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                # Insert playlist
                cursor.execute('''
                    INSERT INTO playlists (
                        id, youtube_id, title, description, url, 
                        video_count, created_by, user_identifier, metadata
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    playlist_id,
                    youtube_id,
                    title,
                    description,
                    url,
                    video_count,
                    created_by,
                    user_identifier,
                    json.dumps(metadata) if metadata else None
                ))
                
                # Insert videos if provided
                if videos:
                    for position, video in enumerate(videos):
                        cursor.execute('''
                            INSERT INTO playlist_videos (
                                playlist_id, video_id, video_title, 
                                video_channel, video_duration, position
                            ) VALUES (?, ?, ?, ?, ?, ?)
                        ''', (
                            playlist_id,
                            video.get('video_id'),
                            video.get('title'),
                            video.get('channel'),
                            video.get('duration'),
                            position
                        ))
                
                logger.info(f"Saved playlist {youtube_id} to database")
                return True
                
        except sqlite3.IntegrityError as e:
            logger.error(f"Playlist {youtube_id} already exists: {e}")
            return False
        except Exception as e:
            logger.error(f"Error saving playlist: {e}")
            return False
    
    def get_playlist_history(
        self,
        user_identifier: Optional[str] = None,
        limit: int = 10,
        offset: int = 0,
        include_videos: bool = False
    ) -> List[Dict[str, Any]]:
        """Get playlist history"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                # Build query
                query = '''
                    SELECT * FROM playlists
                    {} 
                    ORDER BY created_at DESC
                    LIMIT ? OFFSET ?
                '''
                
                params = []
                where_clause = ""
                
                if user_identifier:
                    where_clause = "WHERE user_identifier = ?"
                    params.append(user_identifier)
                
                params.extend([limit, offset])
                
                # Execute query
                cursor.execute(query.format(where_clause), params)
                playlists = [dict(row) for row in cursor.fetchall()]
                
                # Get videos if requested
                if include_videos and playlists:
                    playlist_ids = [p['id'] for p in playlists]
                    placeholders = ','.join(['?' for _ in playlist_ids])
                    
                    cursor.execute(f'''
                        SELECT * FROM playlist_videos
                        WHERE playlist_id IN ({placeholders})
                        ORDER BY playlist_id, position
                    ''', playlist_ids)
                    
                    videos = cursor.fetchall()
                    
                    # Group videos by playlist
                    videos_by_playlist = {}
                    for video in videos:
                        playlist_id = video['playlist_id']
                        if playlist_id not in videos_by_playlist:
                            videos_by_playlist[playlist_id] = []
                        videos_by_playlist[playlist_id].append(dict(video))
                    
                    # Add videos to playlists
                    for playlist in playlists:
                        playlist['videos'] = videos_by_playlist.get(playlist['id'], [])
                
                return playlists
                
        except Exception as e:
            logger.error(f"Error getting playlist history: {e}")
            return []
    
    def get_playlist_by_id(self, playlist_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific playlist by ID"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                cursor.execute('SELECT * FROM playlists WHERE id = ?', (playlist_id,))
                playlist = cursor.fetchone()
                
                if playlist:
                    playlist_dict = dict(playlist)
                    
                    # Get videos
                    cursor.execute('''
                        SELECT * FROM playlist_videos
                        WHERE playlist_id = ?
                        ORDER BY position
                    ''', (playlist_id,))
                    
                    playlist_dict['videos'] = [dict(row) for row in cursor.fetchall()]
                    
                    return playlist_dict
                
                return None
                
        except Exception as e:
            logger.error(f"Error getting playlist {playlist_id}: {e}")
            return None
    
    def get_statistics(self, user_identifier: Optional[str] = None) -> Dict[str, Any]:
        """Get usage statistics"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                # Base WHERE clause
                where_clause = ""
                params = []
                if user_identifier:
                    where_clause = "WHERE user_identifier = ?"
                    params = [user_identifier]
                
                # Total playlists
                cursor.execute(f'SELECT COUNT(*) as count FROM playlists {where_clause}', params)
                total_playlists = cursor.fetchone()['count']
                
                # Total videos
                if user_identifier:
                    cursor.execute('''
                        SELECT COUNT(*) as count FROM playlist_videos pv
                        JOIN playlists p ON pv.playlist_id = p.id
                        WHERE p.user_identifier = ?
                    ''', [user_identifier])
                else:
                    cursor.execute('SELECT COUNT(*) as count FROM playlist_videos')
                total_videos = cursor.fetchone()['count']
                
                # Playlists today
                cursor.execute(f'''
                    SELECT COUNT(*) as count FROM playlists
                    {where_clause}
                    {"AND" if where_clause else "WHERE"} date(created_at) = date('now')
                ''', params)
                playlists_today = cursor.fetchone()['count']
                
                # Average playlist size
                cursor.execute(f'''
                    SELECT AVG(video_count) as avg_size FROM playlists
                    {where_clause}
                ''', params)
                avg_size = cursor.fetchone()['avg_size'] or 0
                
                # Most common videos
                if user_identifier:
                    cursor.execute('''
                        SELECT video_id, video_title, COUNT(*) as count
                        FROM playlist_videos pv
                        JOIN playlists p ON pv.playlist_id = p.id
                        WHERE p.user_identifier = ?
                        GROUP BY video_id
                        ORDER BY count DESC
                        LIMIT 10
                    ''', [user_identifier])
                else:
                    cursor.execute('''
                        SELECT video_id, video_title, COUNT(*) as count
                        FROM playlist_videos
                        GROUP BY video_id
                        ORDER BY count DESC
                        LIMIT 10
                    ''')
                
                most_common = [dict(row) for row in cursor.fetchall()]
                
                return {
                    'total_playlists': total_playlists,
                    'total_videos': total_videos,
                    'playlists_today': playlists_today,
                    'average_playlist_size': round(avg_size, 2),
                    'most_common_videos': most_common
                }
                
        except Exception as e:
            logger.error(f"Error getting statistics: {e}")
            return {
                'total_playlists': 0,
                'total_videos': 0,
                'playlists_today': 0,
                'average_playlist_size': 0,
                'most_common_videos': []
            }
    
    def log_api_usage(
        self,
        service: str,
        operation: str,
        tokens_used: Optional[int] = None,
        cost_estimate: Optional[float] = None
    ):
        """Log API usage for cost tracking"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                cursor.execute('''
                    INSERT INTO api_usage (service, operation, tokens_used, cost_estimate)
                    VALUES (?, ?, ?, ?)
                ''', (service, operation, tokens_used, cost_estimate))
                
        except Exception as e:
            logger.error(f"Error logging API usage: {e}")


# Global database instance
db = PlaylistDatabase()