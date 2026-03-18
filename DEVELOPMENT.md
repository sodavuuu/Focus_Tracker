# Focus Tracker - Development Guide

## Architecture Overview

### Project Layout
```
focus-tracker/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/             # Utilities & database
│   ├── types/           # TypeScript definitions
│   └── globals.css      # Global styles
├── .data/               # SQLite database (generated)
├── public/              # Static assets
├── package.json         # Dependencies
└── next.config.ts       # Next.js config
```

## Component Hierarchy

```
Home (page.tsx)
└── FocusTracker.tsx
    ├── CountdownTimer.tsx
    ├── Statistics.tsx
    │   └── Recharts LineChart
    └── SessionHistory.tsx
```

## API Routes

### Start Session
**POST** `/api/sessions/start`

Request:
```json
{
  "name": "Deep Work",
  "type": "pomodoro"
}
```

Response:
```json
{
  "success": true,
  "sessionId": 1,
  "startTime": 1710816000000
}
```

### End Session
**POST** `/api/sessions/end`

Request:
```json
{
  "sessionId": 1,
  "completed": true
}
```

Response:
```json
{
  "success": true,
  "sessionId": 1,
  "duration": 1500
}
```

### List Sessions
**GET** `/api/sessions/list?days=7&completed=true`

Response:
```json
{
  "sessions": [
    {
      "id": 1,
      "startTime": 1710816000000,
      "endTime": 1710817500000,
      "duration": 1500,
      "completed": true,
      "name": "Deep Work",
      "type": "pomodoro",
      "createdAt": 1710816000000
    }
  ]
}
```

### Daily Statistics
**GET** `/api/stats/daily?days=7`

Response:
```json
{
  "data": [
    {
      "date": "2024-03-18",
      "sessions": 3,
      "totalDuration": 4500,
      "avgDuration": 1500
    }
  ]
}
```

## State Management

### FocusTracker Component State
```typescript
// Timer control
const [isRunning, setIsRunning] = useState(false);
const [sessionId, setSessionId] = useState<number | null>(null);
const [elapsedTime, setElapsedTime] = useState(0);
const [totalDuration, setTotalDuration] = useState(25 * 60);

// Session metadata
const [sessionName, setSessionName] = useState('Focus Session');
```

### Data Fetching
- `SessionHistory`: Fetches sessions every 5 seconds
- `Statistics`: Fetches stats every 10 seconds
- Client-side refresh using `useEffect` with intervals

## Database Operations

### Initialize Database
```typescript
import getDatabase from '@/lib/db';

const db = getDatabase();
// Database is automatically created and initialized
```

### Query Examples

#### Get all sessions
```typescript
const sessions = db.prepare('SELECT * FROM sessions ORDER BY createdAt DESC').all();
```

#### Get this week's sessions
```typescript
const week = 7 * 24 * 60 * 60 * 1000;
const sessions = db.prepare(
  'SELECT * FROM sessions WHERE createdAt >= ?'
).all(Date.now() - week);
```

#### Calculate statistics
```typescript
const stats = db.prepare(`
  SELECT 
    COUNT(*) as count,
    SUM(duration) as total,
    AVG(duration) as avg
  FROM sessions 
  WHERE completed = 1
`).get();
```

## Styling

### Tailwind CSS Classes Used

**Colors:**
- Slate: `slate-900`, `slate-800`, `slate-400`
- Blue: `blue-400`, `blue-500`, `blue-600`
- Purple: `purple-400`, `purple-500`, `purple-600`
- Yellow/Green/Red: Status colors

**Components:**
- Glassmorphism: `backdrop-blur-xl bg-white/5 border border-white/10`
- Buttons: `rounded-lg px-8 py-3 font-semibold transition`
- Cards: `rounded-3xl p-8 shadow-2xl`

## Animation Patterns

### Framer Motion

**Entry animations:**
```typescript
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

**Button interactions:**
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

**Circular progress:**
```typescript
<motion.circle
  initial={{ strokeDashoffset: circumference }}
  animate={{ strokeDashoffset }}
  transition={{ duration: 0.5, ease: 'linear' }}
/>
```

## Performance Optimization

### Database
- `WAL` (Write-Ahead Logging) mode for concurrent access
- Indexes on `createdAt` for fast filtering
- Batch updates where possible

### React
- Client-side components marked with `'use client'`
- Interval cleanup in `useEffect`
- Memoization through component splitting

### Network
- Interval-based polling (5-10 seconds)
- Conditional fetching (only fetch if data needed)
- Error handling for failed requests

## Error Handling

### API Routes
```typescript
try {
  // Operation
  return NextResponse.json({ success: true });
} catch (error) {
  console.error('Error message:', error);
  return NextResponse.json(
    { error: 'Human readable message' },
    { status: 500 }
  );
}
```

### Client Components
```typescript
try {
  const response = await fetch('/api/endpoint');
  const data = await response.json();
} catch (error) {
  console.error('Error:', error);
  // Fallback UI
}
```

## Development Tips

### Running the dev server
```bash
cd focus-tracker
npm run dev
```

Server runs at `http://localhost:3000`

### Database inspection
```bash
# Install SQLite CLI
sqlite3 .data/focus-tracker.db

# View tables
.tables

# Query data
SELECT * FROM sessions;
```

### Build for production
```bash
npm run build
npm start
```

### Debugging

Enable logging in database:
```typescript
// In src/lib/db.ts
if (process.env.DEBUG) {
  db.pragma('query_only = false');
  // Add logging
}
```

Check browser DevTools:
- Network tab for API calls
- Console for errors
- React DevTools for component state

## Deployment Checklist

- [ ] Test all features locally
- [ ] Run `npm run build` successfully
- [ ] Set environment variables
- [ ] Configure database path for production
- [ ] Test with production build: `npm start`
- [ ] Set up backups for `.data/focus-tracker.db`
- [ ] Configure CORS if needed
- [ ] Enable telemetry (optional)

## Common Issues

### Database locked
- Check WAL files in `.data/` directory
- Restart server

### Sessions not saving
- Check `.data/` directory permissions
- Verify SQLite version compatibility

### Slow queries
- Add indexes: `CREATE INDEX IF NOT EXISTS idx_name ON table(column);`
- Use EXPLAIN QUERY PLAN

### API errors
- Check browser console for detailed errors
- Verify request/response format
- Check server logs