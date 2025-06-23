# YouTube Playlist Generator - Next.js Edition

A modern web application for creating YouTube playlists with AI-generated titles, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎥 **Instant Playlist Creation** - Add YouTube videos and create playlists in seconds
- 🤖 **AI-Powered Titles** - Generate creative playlist titles using OpenAI
- 🔐 **OAuth Integration** - Secure authentication with Google/YouTube
- 📊 **Analytics Dashboard** - Track your playlist creation history and statistics
- 🤖 **Telegram Bot** - Create playlists via Telegram
- 🌙 **Dark Mode** - Modern UI with dark theme support
- ⚡ **Real-time Validation** - Instant YouTube URL validation
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js v5
- **APIs**: YouTube Data API v3, OpenAI API
- **Testing**: Jest, React Testing Library, Playwright

## Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/youtube-playlist-next.git
cd youtube-playlist-next
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

4. **Initialize the database**
```bash
npx prisma generate
npx prisma migrate deploy
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to see the application.

## Configuration

### Required Environment Variables

- `NEXTAUTH_URL` - Your application URL
- `NEXTAUTH_SECRET` - Secret for NextAuth (generate with `openssl rand -hex 32`)
- `YOUTUBE_CLIENT_ID` - Google OAuth client ID
- `YOUTUBE_CLIENT_SECRET` - Google OAuth client secret
- `OPENAI_API_KEY` - OpenAI API key for title generation

### Optional Environment Variables

- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` - Telegram bot username

## Project Structure

```
youtube-playlist-next/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── history/           # History page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── lib/                   # Utilities and configurations
├── prisma/                # Database schema and migrations
├── scripts/               # Utility scripts
├── tests/                 # Test files
└── public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `./scripts/backup.sh` - Create backup
- `./scripts/restore.sh` - Restore from backup

## API Endpoints

### Playlists
- `GET /api/playlists` - Get user's playlists
- `POST /api/playlists` - Create new playlist
- `GET /api/playlists/[id]` - Get specific playlist
- `DELETE /api/playlists/[id]` - Delete playlist

### Videos
- `POST /api/videos/validate` - Validate YouTube URLs

### Stats
- `GET /api/stats` - Get user statistics

### Other
- `GET /api/health` - Health check endpoint
- `POST /api/telegram/webhook` - Telegram bot webhook

## Development

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npx playwright test

# Test coverage
npm run test:coverage
```

### Code Style

The project uses ESLint and Prettier for code formatting. Configuration is in `eslint.config.mjs`.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy with Docker

```bash
docker-compose up -d
```

### Deploy to CapRover

```bash
caprover deploy
```

## Migration from Python Version

If you're migrating from the Python/FastAPI version:

1. Copy your existing database file
2. Run the migration script:
```bash
npx tsx scripts/migrate-data.ts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## Support

For issues and questions:
- Open an issue on GitHub
- Check the [documentation](./docs/)
- Review [deployment guide](./DEPLOYMENT.md)
