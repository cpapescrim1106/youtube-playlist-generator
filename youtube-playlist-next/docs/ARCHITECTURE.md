# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           Frontend                               │
├─────────────────────────────────────────────────────────────────┤
│                     Next.js App Router                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │   Pages     │  │  Components  │  │   Client Hooks     │    │
│  │  - Home     │  │ - Playlist   │  │ - usePlaylist      │    │
│  │  - History  │  │ - Video      │  │ - useStats         │    │
│  │  - Auth     │  │ - Stats      │  │ - useKeyboard      │    │
│  └─────────────┘  └──────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          API Routes                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  Playlists  │  │    Videos    │  │      Other         │    │
│  │  - Create   │  │  - Validate  │  │  - Stats           │    │
│  │  - Read     │  │              │  │  - Health          │    │
│  │  - Delete   │  │              │  │  - Telegram        │    │
│  └─────────────┘  └──────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐
│   External APIs  │  │   Database   │  │  Authentication  │
├──────────────────┤  ├──────────────┤  ├──────────────────┤
│ - YouTube Data   │  │   SQLite     │  │    NextAuth      │
│ - OpenAI GPT     │  │   + Prisma   │  │  Google OAuth    │
│ - Telegram Bot   │  │              │  │                  │
└──────────────────┘  └──────────────┘  └──────────────────┘
```

## Component Architecture

```
app/
├── layout.tsx                 # Root layout with providers
├── page.tsx                   # Home page
├── history/
│   └── page.tsx              # History & stats page
└── api/
    ├── auth/                 # NextAuth endpoints
    ├── playlists/           # Playlist CRUD
    ├── videos/              # Video validation
    ├── stats/               # Statistics
    ├── health/              # Health check
    └── telegram/            # Bot webhook

components/
├── ui/                      # Base UI components (shadcn)
├── playlist-creator.tsx     # Main playlist form
├── video-input.tsx         # Video URL input
├── playlist-history.tsx    # History display
├── stats-dashboard.tsx     # Statistics view
└── navigation.tsx          # App navigation

lib/
├── prisma.ts               # Database client
├── auth.ts                 # NextAuth config
├── youtube.ts              # YouTube API client
├── openai.ts               # OpenAI client
├── telegram.ts             # Telegram bot
└── utils.ts                # Helper functions
```

## Data Flow

### Playlist Creation Flow

```
User Input → Video Validation → Create Playlist → Generate Title → Save to DB
     │              │                  │                │              │
     └──────────────┴──────────────────┴────────────────┴──────────────┘
                                       │
                              Return Playlist URL
```

### Authentication Flow

```
User → Google OAuth → NextAuth → Session → API Access
          │              │          │          │
          └──────────────┴──────────┴──────────┘
                         │
                   Store in Cookie
```

## Database Schema

### Playlists Table
- `id` - Primary key
- `playlistId` - YouTube playlist ID
- `title` - Playlist title
- `videoCount` - Number of videos
- `privacy` - Privacy setting
- `url` - YouTube URL
- `videos` - JSON array of video IDs
- `userId` - User identifier
- `aiGenerated` - Title generation flag
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

### NextAuth Tables
- `accounts` - OAuth accounts
- `sessions` - User sessions
- `users` - User profiles
- `verification_tokens` - Email verification

## Security Architecture

### Authentication & Authorization
- Google OAuth 2.0 for user authentication
- NextAuth.js for session management
- Secure HTTP-only cookies
- CSRF protection built-in

### API Security
- All API routes require authentication (except health & webhook)
- Input validation on all endpoints
- Rate limiting per user
- SQL injection prevention via Prisma

### Data Security
- Environment variables for secrets
- No sensitive data in client-side code
- HTTPS required in production
- Secure cookie settings

## Deployment Architecture

### Docker Container
```
Docker Container
├── Next.js Server (port 3000)
├── SQLite Database (file)
└── Static Assets
```

### CapRover Deployment
```
CapRover
├── App Container
├── Persistent Volume (/app/youtube_playlists.db)
├── SSL Termination (Let's Encrypt)
└── Health Monitoring
```

## Performance Optimizations

### Frontend
- Dynamic imports for code splitting
- Skeleton screens for loading states
- Optimistic UI updates
- Image optimization

### Backend
- Database connection pooling
- Efficient queries with Prisma
- Response caching where appropriate
- Standalone Next.js build

### Caching Strategy
- Static assets: 1 year cache
- API responses: No cache (real-time data)
- Auth sessions: Secure cookie storage

## Monitoring & Observability

### Health Checks
- `/api/health` endpoint
- Database connectivity check
- Uptime tracking

### Error Handling
- Global error boundary
- API error responses
- Client-side error logging

### Future Monitoring
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Analytics integration