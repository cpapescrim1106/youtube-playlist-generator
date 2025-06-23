# YouTube Playlist Generator - Next.js/TypeScript Refactor Plan

## 🎯 Planning Overview

**Project**: Complete refactor from Python/FastAPI to Next.js/TypeScript
**Estimated Duration**: 15 AI sessions (45-60 minutes each)
**Strategy**: Incremental migration with feature parity at each checkpoint

## 📋 Pre-Refactor Checklist

### Step 1: Requirements Analysis ✓
- [x] Read the full PRD
- [x] Identified core functionality: Web UI, Telegram bot, REST API, AI titles, OAuth, SQLite, Stats
- [x] Listed user interactions: Create playlists, view history, check stats, use Telegram bot
- [x] Technical constraints: Must maintain CapRover deployment, preserve existing data
- [x] Dependencies: YouTube API, OpenAI API, Telegram API, OAuth2
- [x] Questions clarified: Migration strategy confirmed, keeping all features

### Step 2: Technical Discovery ✓
- [x] Explored existing codebase structure
- [x] Identified patterns: FastAPI routes, SQLite queries, OAuth flow
- [x] Found reusable logic: Playlist creation, video validation, AI title generation
- [x] Checked libraries: All have Next.js equivalents
- [x] Reviewed documentation: API integrations documented
- [x] Technical challenges: OAuth migration, Telegram webhook handling

### Step 3: Solution Design ✓
- [x] Architecture: Next.js App Router with API routes
- [x] Data models: Prisma schema matching existing SQLite
- [x] API endpoints: Direct mapping from FastAPI to Next.js routes
- [x] UI components: React with shadcn/ui
- [x] Interfaces: TypeScript types for all data flows
- [x] Error handling: Comprehensive try-catch with user feedback
- [x] Edge cases: Rate limiting, quota management, invalid URLs

### Step 4: Task Breakdown ✓
- [x] Created ordered list of 15 sessions
- [x] Each task sized for one AI session
- [x] Checkpoint commits planned every 2-3 tasks
- [x] Dependencies identified between tasks
- [x] Testable completion criteria defined
- [x] Natural break points marked

### Step 5: Risk Assessment ✓
- [x] Technical risks: OAuth migration complexity
- [x] Performance: Next.js should improve performance
- [x] Security: Environment variables, auth checks
- [x] Mitigation: Test each integration thoroughly
- [x] Fallback: Keep Python version running during migration

## 🗂️ AI-Optimized Session Plan

### Session 1: Project Foundation ✅
**Duration**: 45 minutes | **Files**: 3-4 | **Complexity**: Low

#### Tasks:
1. [x] Initialize Next.js project with T3 stack (customized)
   ```bash
   npx create-next-app@latest youtube-playlist-next --typescript --tailwind --app
   ```
2. [x] Add Prisma and NextAuth packages manually
3. [x] Set up initial folder structure per PRD
4. [x] Create `.env.example` with all required variables

**CHECKPOINT**: ✅ Commit working Next.js foundation

#### Success Criteria:
- ✅ Next.js app runs locally
- ✅ TypeScript configured
- ✅ Folder structure matches PRD
- ✅ Environment variables documented

---

### Session 2: Database & Prisma Setup ✅
**Duration**: 45 minutes | **Files**: 2-3 | **Complexity**: Medium

#### Tasks:
1. [x] Create Prisma schema matching existing SQLite structure
2. [x] Set up database connection
3. [x] Generate Prisma client
4. [x] Create migration from existing database

**CHECKPOINT**: ✅ Test database connection and queries

#### Success Criteria:
- ✅ Prisma schema matches existing tables
- ✅ Can query existing data (copied existing playlists.db)
- ✅ Migrations ready for deployment

---

### Session 3: NextAuth Configuration ✅
**Duration**: 60 minutes | **Files**: 4-5 | **Complexity**: High

#### Tasks:
1. [x] Configure NextAuth with YouTube OAuth provider
2. [x] Create auth API route handler
3. [x] Set up session management
4. [x] Implement auth middleware

**CHECKPOINT**: ✅ Test OAuth flow completely

#### Success Criteria:
- ✅ YouTube OAuth configured (NextAuth v5)
- ✅ Sessions management implemented
- ✅ Protected routes secured with middleware

---

### Session 4: Core Library Setup ✅
**Duration**: 45 minutes | **Files**: 4-5 | **Complexity**: Medium

#### Tasks:
1. [x] Create `lib/youtube.ts` with API client
2. [x] Create `lib/openai.ts` for title generation
3. [x] Create `lib/db.ts` with Prisma client (created in Session 2)
4. [x] Set up error handling utilities

**CHECKPOINT**: ✅ Test each library function

#### Success Criteria:
- ✅ YouTube API client implemented
- ✅ OpenAI integration functional
- ✅ Database queries successful
- ✅ Error handling consistent

---

### Session 5: Playlist API Routes ✅
**Duration**: 60 minutes | **Files**: 3-4 | **Complexity**: High

#### Tasks:
1. [x] Create `POST /api/playlists` route
2. [x] Create `GET /api/playlists` route
3. [x] Implement playlist creation logic
4. [x] Add proper error responses

**CHECKPOINT**: ✅ Test API routes with Postman/curl

#### Success Criteria:
- ✅ Can create playlists via API
- ✅ History retrieval works
- ✅ Error handling comprehensive
- ✅ Response formats match original

---

### Session 6: Video Validation & Stats API ✅
**Duration**: 45 minutes | **Files**: 3-4 | **Complexity**: Medium

#### Tasks:
1. [x] Create `POST /api/videos/validate` route
2. [x] Create `GET /api/stats` route
3. [x] Port validation logic from Python
4. [x] Implement statistics aggregation

**CHECKPOINT**: ✅ Full API test suite passing

#### Success Criteria:
- ✅ Video validation accurate
- ✅ Stats calculations correct
- ✅ API fully functional
- ✅ Performance acceptable

---

### Session 7: Telegram Bot Handler ✅
**Duration**: 60 minutes | **Files**: 3-4 | **Complexity**: High

#### Tasks:
1. [x] Create `POST /api/telegram/webhook` route
2. [x] Port Telegram bot logic
3. [x] Implement user authentication check
4. [x] Set up message parsing and responses

**CHECKPOINT**: ✅ Test bot with actual Telegram messages

#### Success Criteria:
- ✅ Webhook receives messages
- ✅ Bot creates playlists
- ✅ Authentication works
- ✅ Responses formatted correctly

---

### Session 8: Base UI Components ✅
**Duration**: 45 minutes | **Files**: 4-5 | **Complexity**: Medium

#### Tasks:
1. [x] Set up shadcn/ui
2. [x] Create base layout with dark theme
3. [x] Build navigation component
4. [x] Create loading/error components

**CHECKPOINT**: ✅ UI framework operational

#### Success Criteria:
- ✅ Dark theme applied
- ✅ Components render correctly
- ✅ Responsive design works
- ✅ shadcn/ui integrated (manual setup due to Tailwind v4)

---

### Session 9: Playlist Creator Component
**Duration**: 60 minutes | **Files**: 3-4 | **Complexity**: High

#### Tasks:
1. [ ] Create `PlaylistCreator` component
2. [ ] Build `VideoInput` with validation
3. [ ] Implement AI title generation UI
4. [ ] Add loading states and error handling

**CHECKPOINT**: Can create playlists via UI

#### Success Criteria:
- Form validates URLs
- AI titles generate
- Playlists create successfully
- User feedback clear

---

### Session 10: History & Stats Components
**Duration**: 45 minutes | **Files**: 3-4 | **Complexity**: Medium

#### Tasks:
1. [ ] Create `PlaylistHistory` component
2. [ ] Build `StatsDashboard` component
3. [ ] Implement data fetching hooks
4. [ ] Add refresh functionality

**CHECKPOINT**: Full UI feature parity

#### Success Criteria:
- History displays correctly
- Stats accurate and live
- UI matches original design
- Performance optimized

---

### Session 11: Polish & Optimization
**Duration**: 45 minutes | **Files**: 4-5 | **Complexity**: Medium

#### Tasks:
1. [ ] Add proper TypeScript types everywhere
2. [ ] Implement proper caching
3. [ ] Optimize bundle size
4. [ ] Add PWA capabilities

**CHECKPOINT**: Production-ready build

#### Success Criteria:
- No TypeScript errors
- Performance improved
- Bundle size optimized
- PWA features work

---

### Session 12: Docker & CapRover Setup
**Duration**: 45 minutes | **Files**: 3-4 | **Complexity**: Medium

#### Tasks:
1. [ ] Create multi-stage Dockerfile
2. [ ] Set up captain-definition
3. [ ] Configure build scripts
4. [ ] Test container locally

**CHECKPOINT**: Docker image builds and runs

#### Success Criteria:
- Container builds successfully
- App runs in container
- Environment variables work
- Ready for deployment

---

### Session 13: Testing Suite
**Duration**: 60 minutes | **Files**: 5-6 | **Complexity**: High

#### Tasks:
1. [ ] Set up Jest and React Testing Library
2. [ ] Write component tests
3. [ ] Create API route tests
4. [ ] Add E2E test with Puppeteer MCP

**CHECKPOINT**: All tests passing

#### Success Criteria:
- Unit tests comprehensive
- Integration tests work
- E2E flow validated
- Coverage > 80%

---

### Session 14: Migration & Deployment
**Duration**: 45 minutes | **Files**: 2-3 | **Complexity**: High

#### Tasks:
1. [ ] Deploy to CapRover staging
2. [ ] Test all features in production
3. [ ] Set up monitoring
4. [ ] Create rollback plan

**CHECKPOINT**: Staging deployment successful

#### Success Criteria:
- App deployed successfully
- All features work
- Performance acceptable
- Monitoring active

---

### Session 15: Documentation & Handoff
**Duration**: 30 minutes | **Files**: 3-4 | **Complexity**: Low

#### Tasks:
1. [ ] Update README.md
2. [ ] Create migration guide
3. [ ] Document API changes
4. [ ] Update CLAUDE.md

**CHECKPOINT**: Project complete

#### Success Criteria:
- Documentation comprehensive
- Migration guide clear
- API docs updated
- Ready for production

---

### Session 16: Production Validation & Cleanup (POST-DEPLOYMENT)
**Duration**: 45 minutes | **Files**: Many | **Complexity**: Low
**Prerequisites**: App running stable in production for at least 1 week

#### Tasks:
1. [ ] Verify all features working in production
2. [ ] Confirm no rollbacks needed
3. [ ] Create backup of old Python code (zip archive)
4. [ ] Remove old Python files:
   - [ ] Delete `src/` directory (Python code)
   - [ ] Delete `test_*.py` files
   - [ ] Delete `requirements.txt`
   - [ ] Delete old `Dockerfile` (keep new one)
   - [ ] Delete `supervisord.conf`
   - [ ] Delete `frontend/` directory (old HTML)
5. [ ] Update `.gitignore` for Next.js
6. [ ] Final commit with cleanup

**CHECKPOINT**: Repository cleaned up

#### Files to Remove:
```
# Python application files
src/
├── api.py
├── bot.py
├── playlist_core.py
├── database.py
├── models.py
├── config.py
└── youtube_auth.py

# Test files
test_api.py
test_api_endpoints.py
test_database.py
test_playlist.py
test_playlist_oauth.py
test_bot.py
quick_test.py
setup_oauth.py

# Old frontend
frontend/
└── index.html

# Python dependencies
requirements.txt
__pycache__/

# Old deployment configs
supervisord.conf
deployment/services/ (if not needed)

# Old Docker files (keep new ones)
Dockerfile.old (rename current before deleting)
docker-compose.yml (if replaced)
```

#### Files to Keep:
```
# Next.js application (all new files)
# Documentation
README.md (updated)
CLAUDE.md (updated)
PRD-nextjs-refactor.md
REFACTOR-PLAN-NextJS.md
LICENSE
.env.example (updated)

# CapRover files
captain-definition (updated for Next.js)
Dockerfile (new Next.js version)

# Git files
.git/
.gitignore (updated)
```

#### Success Criteria:
- No old Python code remains
- Git history preserved
- Backup archive created
- Repository size reduced
- Clean Next.js-only codebase

## 🔍 Testing Strategy

### After Each Session:
1. **Functional Testing**: Verify new features work
2. **Regression Testing**: Ensure nothing broke
3. **Integration Testing**: Check API connections
4. **Visual Testing**: Use Puppeteer MCP for UI

### Test Checklist per Feature:
- [ ] Happy path works
- [ ] Error cases handled
- [ ] Edge cases covered
- [ ] Performance acceptable
- [ ] Security validated

## 📊 Progress Tracking

### Session Completion Log:
```
Session 1: [x] Date: 2024-06-23 | Duration: 45 min | Issues: T3 stack interactive prompts - used create-next-app instead
Session 2: [x] Date: 2024-06-23 | Duration: 30 min | Issues: Prisma env loading - resolved
Session 3: [x] Date: 2024-06-23 | Duration: 40 min | Issues: NextAuth v5 type declarations
Session 4: [x] Date: 2024-06-23 | Duration: 30 min | Issues: None
Session 5: [x] Date: 2024-06-23 | Duration: 35 min | Issues: None
Session 6: [x] Date: 2024-06-23 | Duration: 25 min | Issues: None
Session 7: [x] Date: 2024-06-23 | Duration: 40 min | Issues: None
Session 8: [x] Date: 2024-06-23 | Duration: 30 min | Issues: Tailwind v4 with shadcn - manual setup
Session 9: [ ] Date: _____ | Duration: _____ | Issues: _____
Session 10: [ ] Date: _____ | Duration: _____ | Issues: _____
Session 11: [ ] Date: _____ | Duration: _____ | Issues: _____
Session 12: [ ] Date: _____ | Duration: _____ | Issues: _____
Session 13: [ ] Date: _____ | Duration: _____ | Issues: _____
Session 14: [ ] Date: _____ | Duration: _____ | Issues: _____
Session 15: [ ] Date: _____ | Duration: _____ | Issues: _____

--- PRODUCTION VALIDATION PERIOD (1 WEEK) ---

Session 16: [ ] Date: _____ | Duration: _____ | Issues: _____
```

## 🚀 Starting Each Session

### Session Template:
```
I need to continue the YouTube Playlist Generator refactor to Next.js/TypeScript.

Current session: Session [X] - [Session Title]
Previous progress: [What was completed in last session]
PRD location: /PRD-nextjs-refactor.md
Plan location: /REFACTOR-PLAN-NextJS.md

Please complete the tasks for Session [X] as outlined in the plan.
```

## ⚠️ Important Reminders

1. **Preserve ALL existing functionality** - no features should be lost
2. **Test after EVERY task** - catch issues early
3. **Commit at checkpoints** - maintain working state
4. **Keep sessions focused** - don't exceed file limits
5. **Document decisions** - update plan with learnings

## 🎯 Success Metrics

### Per Session:
- Tasks completed: ___/___
- Tests passing: ___/___
- Time spent: ___ minutes
- Blockers encountered: ___

### Overall Project:
- [ ] Feature parity achieved
- [ ] Performance improved (< 1.5s load)
- [ ] TypeScript 100% coverage
- [ ] All tests passing
- [ ] Successfully deployed
- [ ] Documentation updated

## 📝 Notes Section

### Decisions Made:
- 

### Challenges Encountered:
- 

### Lessons Learned:
- 

---

This plan is optimized for AI context windows with small, focused sessions. Each session can be completed independently with clear checkpoints for progress tracking.