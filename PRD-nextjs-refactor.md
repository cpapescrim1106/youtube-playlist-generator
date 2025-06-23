# Product Requirements Document: YouTube Playlist Generator - Next.js/TypeScript Refactor

## Executive Summary

**Project**: Refactor YouTube Playlist Generator from Python/FastAPI to Next.js/TypeScript
**Duration**: 10-15 AI development sessions
**Goal**: Modernize the codebase while maintaining all existing functionality and improving developer experience

## Current State Analysis

### Existing Features (Must Preserve)
1. **Web Interface**: Dark-themed UI for playlist creation
2. **Telegram Bot**: Message-based playlist creation
3. **REST API**: Public endpoints for programmatic access
4. **AI Title Generation**: OpenAI integration for creative names
5. **OAuth2 Flow**: YouTube authentication for playlist creation
6. **Database**: SQLite storage for playlist history
7. **Statistics**: Usage tracking and analytics

### Technical Stack (Current)
- **Backend**: Python, FastAPI, Uvicorn
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Database**: SQLite with raw SQL
- **APIs**: YouTube Data API v3, OpenAI, Telegram Bot API
- **Deployment**: Docker, CapRover

## Target Architecture

### New Technical Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript throughout
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: NextAuth.js for OAuth flows
- **API**: Next.js API routes (replacing FastAPI)
- **Deployment**: Docker, CapRover (maintained)

### Key Improvements
1. **Type Safety**: Full TypeScript coverage
2. **Modern UI**: React components with shadcn/ui
3. **Better DX**: Hot reload, type checking, modern tooling
4. **Performance**: Next.js optimizations, edge functions
5. **Maintainability**: Cleaner architecture, better testing

## Migration Strategy

### Phase 1: Project Setup (Sessions 1-2)
- Initialize Next.js with TypeScript
- Set up Prisma with SQLite
- Configure environment variables
- Create Docker configuration for CapRover

### Phase 2: Core Infrastructure (Sessions 3-5)
- Implement Prisma schema matching current database
- Set up NextAuth.js with YouTube OAuth
- Create API route structure
- Implement error handling and logging

### Phase 3: API Migration (Sessions 6-8)
- Port all FastAPI endpoints to Next.js API routes
- Implement YouTube API integration
- Add OpenAI integration
- Create Telegram webhook handler

### Phase 4: Frontend Migration (Sessions 9-11)
- Convert HTML to React components
- Implement dark theme with Tailwind
- Add shadcn/ui components
- Create responsive layouts

### Phase 5: Feature Parity (Sessions 12-13)
- Telegram bot functionality
- Statistics and analytics
- History tracking
- Testing and validation

### Phase 6: Deployment (Sessions 14-15)
- Docker configuration
- CapRover setup
- Environment configuration
- Production testing

## Detailed Technical Specifications

### File Structure
```
youtube-playlist-generator-next/
├── app/
│   ├── layout.tsx              # Root layout with dark theme
│   ├── page.tsx                # Home page (playlist creator)
│   ├── stats/page.tsx          # Statistics page
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # OAuth handlers
│   │   ├── playlists/route.ts           # Playlist CRUD
│   │   ├── videos/validate/route.ts     # Video validation
│   │   ├── stats/route.ts               # Statistics endpoint
│   │   └── telegram/webhook/route.ts    # Telegram bot
│   └── globals.css             # Tailwind imports
├── components/
│   ├── playlist-creator.tsx   # Main form component
│   ├── video-input.tsx        # URL input with validation
│   ├── playlist-history.tsx   # History display
│   ├── stats-dashboard.tsx    # Analytics UI
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── youtube.ts             # YouTube API client
│   ├── openai.ts              # OpenAI integration
│   ├── telegram.ts            # Telegram bot logic
│   ├── db.ts                  # Prisma client
│   └── auth.ts                # NextAuth config
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Schema migrations
├── types/
│   └── index.ts               # TypeScript types
├── middleware.ts              # Auth/CORS middleware
└── next.config.js             # Next.js configuration
```

### Database Schema (Prisma)
```prisma
model Playlist {
  id          String   @id @default(cuid())
  title       String
  youtubeId   String   @map("youtube_id")
  createdAt   DateTime @default(now()) @map("created_at")
  createdBy   String?  @map("created_by")
  videoCount  Int      @map("video_count")
  
  @@map("playlists")
}

model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  telegramId    String?   @unique @map("telegram_id")
  createdAt     DateTime  @default(now()) @map("created_at")
  
  @@map("users")
}
```

### API Routes Mapping
| Current FastAPI | Next.js API Route |
|-----------------|-------------------|
| `POST /api/v1/playlists` | `POST /api/playlists` |
| `GET /api/v1/playlists` | `GET /api/playlists` |
| `GET /api/v1/stats` | `GET /api/stats` |
| `POST /api/v1/videos/validate` | `POST /api/videos/validate` |
| `POST /telegram/webhook` | `POST /api/telegram/webhook` |

### Environment Variables
```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# YouTube API
YOUTUBE_API_KEY=your-key
YOUTUBE_CLIENT_ID=your-client-id
YOUTUBE_CLIENT_SECRET=your-client-secret

# OpenAI
OPENAI_API_KEY=your-key

# Telegram
TELEGRAM_BOT_TOKEN=your-token
TELEGRAM_WEBHOOK_URL=https://your-domain/api/telegram/webhook
ALLOWED_TELEGRAM_USER_ID=your-id

# Database
DATABASE_URL=file:./playlists.db

# Settings
DEFAULT_PLAYLIST_PRIVACY=unlisted
```

### Key Components

#### 1. Playlist Creator Component
```typescript
interface PlaylistCreatorProps {
  onSuccess: (playlist: Playlist) => void;
}

// Features:
// - Multi-line URL input
// - Real-time validation
// - AI title generation
// - Loading states
// - Error handling
```

#### 2. YouTube Integration
```typescript
// lib/youtube.ts
// - OAuth2 flow with NextAuth
// - Playlist creation
// - Video validation
// - Quota management
```

#### 3. Telegram Bot Handler
```typescript
// app/api/telegram/webhook/route.ts
// - Message parsing
// - User authentication
// - Playlist creation
// - Response formatting
```

## CapRover Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Captain Definition
```json
{
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile"
}
```

## Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- API route testing with Next.js test helpers
- Integration tests for YouTube/OpenAI/Telegram

### E2E Tests
- Playwright for user flows
- API endpoint testing
- OAuth flow testing

## Migration Checklist

- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Prisma with existing database schema
- [ ] Configure NextAuth with YouTube OAuth
- [ ] Migrate all API endpoints
- [ ] Convert frontend to React components
- [ ] Implement Telegram bot handler
- [ ] Add comprehensive error handling
- [ ] Set up monitoring and logging
- [ ] Create Docker configuration
- [ ] Test CapRover deployment
- [ ] Migrate existing data
- [ ] Update documentation

## Success Criteria

1. **Feature Parity**: All existing features work identically
2. **Performance**: Page load < 1.5s (improved from 2s)
3. **Type Safety**: 100% TypeScript coverage
4. **Testing**: >80% code coverage
5. **Deployment**: One-command CapRover deployment
6. **Developer Experience**: Hot reload, type checking, modern tooling

## Future Enhancements (Post-Refactor)

1. **Real-time Updates**: WebSocket for live playlist status
2. **Advanced Analytics**: Charts and insights with Recharts
3. **Playlist Templates**: Save and reuse playlist formats
4. **Collaborative Playlists**: Multi-user playlist creation
5. **AI Improvements**: Better title suggestions, description generation
6. **Mobile App**: React Native companion app

## Template Recommendation

**Primary Choice: T3 Stack (Customized)**
```bash
npm create t3-app@latest youtube-playlist-next -- --tailwind --prisma --nextAuth --appRouter --noGit
```
- Remove tRPC (not needed for this project)
- Keep Prisma, NextAuth, Tailwind
- Add shadcn/ui after initialization

**Why T3**: 
- Perfect for this use case
- Includes auth and database setup
- TypeScript configured
- Best practices built-in

## AI Development Instructions

Start each session with:
```
Continue refactoring the YouTube Playlist Generator to Next.js/TypeScript following the PRD. 
Current focus: [specific phase/feature]
Previous progress: [what was completed]
```

Each session should:
1. Complete one specific phase
2. Test thoroughly
3. Commit working code
4. Update progress notes

## Conclusion

This refactor will modernize the YouTube Playlist Generator while maintaining all current functionality. The move to Next.js/TypeScript will improve developer experience, performance, and maintainability while keeping the same deployment simplicity with CapRover.