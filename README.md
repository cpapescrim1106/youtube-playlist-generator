# YouTube Playlist Generator

A personal YouTube playlist generator that receives video lists via Telegram or web UI, uses AI to generate playlist metadata, and creates YouTube playlists automatically.

## Features

- 📱 Telegram bot for easy playlist creation
- 🌐 Web interface using Magic UI MCP
- 🤖 AI-generated playlist titles using OpenAI
- 📺 Automatic YouTube playlist creation
- 📊 History tracking of created playlists
- 🔒 Secure with user authentication

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/youtube-playlist-generator.git
cd youtube-playlist-generator
```

2. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy and configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

5. Run the test script to verify setup:
```bash
python test_playlist.py
```

## Getting API Keys

### YouTube API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key and OAuth 2.0 Client ID)

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and generate API key

### Telegram Bot Token
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot with `/newbot`
3. Copy the bot token

## Usage

### Telegram Bot
Simply send YouTube URLs to your bot:
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/9bZkp7q19f0
https://youtube.com/shorts/abc123
```

The bot will create a playlist and return the link.

### Web API
```bash
# Start the API server
python -m uvicorn src.api:app --reload
```

## Development

See [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) for detailed development guidelines.

## License

This project is for personal use.