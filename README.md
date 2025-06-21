# YouTube Playlist Generator 🎵

Create YouTube playlists instantly with AI-generated titles via Telegram bot or beautiful web interface.

![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)

## ✨ Features

- 🤖 **AI-Powered Titles**: Uses OpenAI to generate creative playlist names
- 📱 **Telegram Bot**: Create playlists by sending YouTube URLs
- 🌐 **Web Interface**: Beautiful dark-themed UI with real-time updates
- 📊 **Statistics Dashboard**: Track your playlist creation history
- 🔐 **OAuth2 Authentication**: Secure YouTube API integration
- 💾 **SQLite Database**: Persistent storage for playlist history
- 🚀 **Fast & Modern**: Built with FastAPI and responsive design

## 🖼️ Screenshots

### Web Interface
- Modern dark theme with YouTube-inspired design
- Real-time statistics and history
- Responsive layout for all devices

### Telegram Bot
- Simple message-based interface
- Instant playlist creation
- Secure user authentication

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- YouTube Data API v3 credentials
- OpenAI API key
- Telegram Bot token (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/cpapescrim1106/youtube-playlist-generator.git
cd youtube-playlist-generator
```

2. **Create virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your API keys
```

5. **Set up YouTube OAuth**
```bash
python setup_oauth.py
```

6. **Run the application**
```bash
# Start API server
python test_api.py

# In another terminal, start the frontend
cd frontend
python3 -m http.server 3000
```

Visit http://localhost:3000 to use the web interface!

## 🔑 Getting API Keys

### YouTube API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create credentials:
   - API Key for read operations
   - OAuth 2.0 Client ID for playlist creation

### OpenAI API
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and generate API key

### Telegram Bot (Optional)
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot with `/newbot`
3. Copy the bot token

## 📖 Usage

### Web Interface
1. Open http://localhost:3000
2. Paste YouTube URLs (one per line)
3. Optionally add a custom title
4. Click "Create Playlist"
5. Copy the playlist link or open directly

### Telegram Bot
Send YouTube URLs to your bot:
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/9bZkp7q19f0
```

### API Endpoints
- `POST /api/v1/playlists` - Create new playlist
- `GET /api/v1/playlists` - Get playlist history
- `GET /api/v1/stats` - Get usage statistics
- `POST /api/v1/videos/validate` - Validate YouTube URLs

Full API documentation at http://localhost:8000/docs

## 🏗️ Project Structure
```
youtube-playlist-generator/
├── src/
│   ├── api.py              # FastAPI backend
│   ├── bot.py              # Telegram bot
│   ├── playlist_core.py    # Core playlist logic
│   ├── database.py         # SQLite integration
│   └── youtube_auth.py     # OAuth2 handler
├── frontend/
│   └── index.html          # Web interface
├── tests/                  # Test files
└── requirements.txt        # Dependencies
```

## 🛠️ Development

### Running Tests
```bash
# Test playlist creation
python test_playlist.py

# Test API endpoints
python test_api_endpoints.py

# Test database
python test_database.py
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 Environment Variables

Create a `.env` file with:
```env
# API Keys
YOUTUBE_API_KEY=your_key
OPENAI_API_KEY=your_key
TELEGRAM_TOKEN=your_token

# OAuth2
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret

# Settings
ALLOWED_TELEGRAM_USER_ID=your_telegram_id
DEFAULT_PLAYLIST_PRIVACY=unlisted
```

## 🚀 Deployment

### Using systemd (Linux)
See deployment files in `deployment/services/`

### Using Docker (Coming Soon)
Docker support is planned for future releases.

## 📄 License

This project is for personal use. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- YouTube Data API v3
- OpenAI for AI-powered titles
- FastAPI for the backend framework
- Telegram Bot API
- All contributors and testers

---

Built with ❤️ using Claude Code