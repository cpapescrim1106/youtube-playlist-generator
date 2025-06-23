# API Documentation

## Base URL

Development: `http://localhost:8080/api`
Production: `https://your-domain.com/api`

## Authentication

Most endpoints require authentication via NextAuth session cookies. The application uses Google OAuth for authentication.

## Endpoints

### Playlists

#### Create Playlist
```http
POST /api/playlists
Content-Type: application/json

{
  "urls": ["https://youtube.com/watch?v=..."],
  "title": "Optional custom title",
  "privacy": "public" | "unlisted" | "private"
}
```

**Response:**
```json
{
  "id": "playlist-id",
  "title": "Generated or custom title",
  "url": "https://youtube.com/playlist?list=...",
  "videoCount": 5,
  "aiGenerated": true
}
```

#### Get User Playlists
```http
GET /api/playlists?limit=10&offset=0
```

**Response:**
```json
{
  "playlists": [
    {
      "id": "1",
      "playlistId": "PLxxxxx",
      "title": "My Playlist",
      "videoCount": 5,
      "privacy": "public",
      "url": "https://youtube.com/playlist?list=PLxxxxx",
      "createdAt": "2024-01-23T10:00:00Z",
      "aiGenerated": true
    }
  ],
  "total": 50
}
```

#### Get Playlist Details
```http
GET /api/playlists/[id]
```

**Response:**
```json
{
  "id": "1",
  "playlistId": "PLxxxxx",
  "title": "My Playlist",
  "videoCount": 5,
  "privacy": "public",
  "url": "https://youtube.com/playlist?list=PLxxxxx",
  "videos": ["video1", "video2"],
  "createdAt": "2024-01-23T10:00:00Z"
}
```

#### Delete Playlist
```http
DELETE /api/playlists/[id]
```

**Response:**
```json
{
  "success": true,
  "message": "Playlist deleted"
}
```

### Videos

#### Validate YouTube URLs
```http
POST /api/videos/validate
Content-Type: application/json

{
  "urls": [
    "https://youtube.com/watch?v=video1",
    "https://youtu.be/video2"
  ]
}
```

**Response:**
```json
{
  "valid": 2,
  "invalid": 0,
  "videos": [
    {
      "url": "https://youtube.com/watch?v=video1",
      "videoId": "video1",
      "title": "Video Title",
      "valid": true
    }
  ]
}
```

### Statistics

#### Get User Statistics
```http
GET /api/stats
```

**Response:**
```json
{
  "totalPlaylists": 42,
  "totalVideos": 210,
  "playlistsThisWeek": 5,
  "playlistsThisMonth": 15,
  "averageVideosPerPlaylist": 5.0,
  "mostUsedPrivacy": "public",
  "aiGeneratedCount": 30,
  "userGeneratedCount": 12
}
```

### Health Check

#### Check Application Health
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-23T10:00:00Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

### Telegram Bot

#### Webhook Endpoint
```http
POST /api/telegram/webhook
Content-Type: application/json

{
  "update_id": 123456789,
  "message": {
    "message_id": 1,
    "from": { ... },
    "chat": { ... },
    "text": "/start"
  }
}
```

**Response:** `200 OK`

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - Not authorized to access resource
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `YOUTUBE_ERROR` - YouTube API error
- `OPENAI_ERROR` - OpenAI API error
- `INTERNAL_ERROR` - Server error

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- Authenticated users: 100 requests per minute
- Unauthenticated users: 20 requests per minute

## WebSocket Events (Future)

Planned WebSocket support for real-time updates:
- `playlist:created` - New playlist created
- `playlist:updated` - Playlist updated
- `playlist:deleted` - Playlist deleted