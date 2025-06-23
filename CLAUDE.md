# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YouTube Playlist Generator - A multi-interface application for creating YouTube playlists with AI-generated titles using FastAPI, Telegram bot integration, and a responsive web UI.

## Core Architecture

### Backend Structure
- **src/api.py**: FastAPI application with REST endpoints, CORS, and static file serving
- **src/playlist_core.py**: Core playlist creation logic with YouTube API integration
- **src/bot.py**: Telegram bot implementation for playlist creation via messaging
- **src/database.py**: SQLite database layer for playlist history and statistics
- **src/youtube_auth.py**: OAuth2 flow handler for YouTube authentication
- **src/config.py**: Pydantic settings management for environment variables
- **src/models.py**: Pydantic models for request/response schemas

### Frontend
- **frontend/index.html**: Single-page application with dark theme, real-time updates, and responsive design

### Key Integration Points
1. **YouTube API**: Both API key (read) and OAuth2 (write) authentication
2. **OpenAI API**: For generating creative playlist titles
3. **Telegram Bot API**: Alternative interface for playlist creation
4. **SQLite**: Local database for persistence

## Essential Commands

### Local Development
```bash
# Setup virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run API server (includes frontend)
python test_api.py

# Run tests
python test_playlist.py          # Core functionality
python test_api_endpoints.py      # API endpoints
python test_database.py           # Database operations
```

### Docker Deployment
```bash
# Build and run with docker-compose
docker-compose up

# Deploy to CapRover
caprover deploy --default
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Setup OAuth credentials
python setup_oauth.py
```

## API Endpoints

- `POST /api/v1/playlists` - Create playlist with video URLs
- `GET /api/v1/playlists` - Retrieve playlist history
- `GET /api/v1/stats` - Get usage statistics
- `POST /api/v1/videos/validate` - Validate YouTube URLs
- `GET /docs` - Swagger UI documentation
- `GET /redoc` - ReDoc documentation

## Testing Approach

The project uses standard Python testing with multiple test files:
- Direct execution: `python test_*.py`
- No test runner framework configured
- Tests require environment variables to be set

## Key Configuration

Environment variables (via `.env`):
- `YOUTUBE_API_KEY` - For video information retrieval
- `YOUTUBE_CLIENT_ID` / `YOUTUBE_CLIENT_SECRET` - OAuth2 credentials
- `OPENAI_API_KEY` - For AI title generation
- `TELEGRAM_TOKEN` - Bot authentication
- `ALLOWED_TELEGRAM_USER_ID` - Security restriction for bot usage
- `DEFAULT_PLAYLIST_PRIVACY` - Default privacy setting (unlisted/public/private)

## Database Schema

SQLite database (`playlists.db`):
- `playlists` table: id, title, youtube_id, created_at, created_by, video_count
- Automatic initialization on first run

## Error Handling Patterns

- FastAPI exception handlers for common errors
- YouTube API quota management
- OpenAI fallback for title generation failures
- Comprehensive logging throughout the application