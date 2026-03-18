# Focus Tracker - Pomodoro Timer & Focus Tracking

A modern, beautiful web application for tracking your focus sessions with Pomodoro timer, session history, and analytics.

🎯 **Features**:
- ⏱️ Customizable Pomodoro timer (15, 25, 45, 90 minutes)
- 📊 Real-time statistics and weekly trends
- 💾 Session history with SQLite database
- 🎨 Beautiful glassmorphism UI with dark mode
- ✨ Smooth animations using Framer Motion
- 📈 Interactive charts using Recharts
- 🎵 Spotify integration to play music while focusing
- ⚡ Fast API routes in Next.js

## Tech Stack

**Frontend:**
- [Next.js 16](https://nextjs.org) - React framework with App Router
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion) - Smooth animations
- [Recharts](https://recharts.org) - Data visualization
- [Spotify Web API](https://developer.spotify.com) - Music streaming

**Backend:**
- Next.js API routes
- [SQLite with better-sqlite3](https://github.com/WiseLibs/better-sqlite3)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── sessions/
│   │   │   ├── start/     # Start new session
│   │   │   ├── end/       # End session
│   │   │   └── list/      # Get sessions
│   │   └── stats/
│   │       └── daily/     # Get daily statistics
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── FocusTracker.tsx   # Main app component
│   ├── CountdownTimer.tsx # Timer visualization
│   ├── Statistics.tsx     # Stats & charts
│   ├── SessionHistory.tsx # Recent sessions
│   └── SpotifyPlayer.tsx  # Spotify music player
├── lib/
│   ├── db.ts              # SQLite database setup
│   └── spotify.ts         # Spotify API service
└── types/
    └── index.ts           # TypeScript types
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- (Optional) Spotify account for music integration

### Installation

1. Navigate to project directory:
```bash
cd focus-tracker
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up Spotify integration:
   - See [SPOTIFY_SETUP.md](SPOTIFY_SETUP.md) for detailed instructions
   - Create `.env.local` with Spotify credentials

4. Start development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Set Session Name** - Enter a custom name for your focus session
2. **Choose Duration** - Select 15, 25, 45, or 90 minutes
3. **Start Focus** - Click button to begin timer
4. **Control Session** - Pause, complete, or cancel anytime
5. **View Stats** - Track your progress with real-time statistics

## API Routes

### Sessions
- `POST /api/sessions/start` - Start new session
- `POST /api/sessions/end` - End session
- `GET /api/sessions/list` - Get session history

### Statistics
- `GET /api/stats/daily` - Get daily statistics

## Database

SQLite database is automatically created at `.data/focus-tracker.db`

### Schema
```sql
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  startTime INTEGER NOT NULL,
  endTime INTEGER,
  duration INTEGER,
  completed BOOLEAN DEFAULT 0,
  name TEXT DEFAULT 'Focus Session',
  type TEXT DEFAULT 'pomodoro',
  createdAt INTEGER NOT NULL
);
```

## Build for Production

```bash
npm run build
npm start
```

## Environment Variables

Create `.env.local` if needed:
```
NODE_ENV=production
```

## Code Quality

- ESLint configured for code linting
- TypeScript for type safety
- Tailwind CSS for consistent styling

## Features Deep Dive

### Timer Display
- Animated circular progress indicator
- Real-time countdown display
- Auto-complete when timer reaches zero

### Statistics Dashboard
- Total sessions count
- Total focus time
- Average session duration
- Weekly trend chart

### Session History
- Recent sessions list

### Spotify Music Integration
- 🎵 Search and play music from Spotify catalog
- 🎧 Control playback while tracking focus
- 📱 Select playback device (phone, computer, etc.)
- 🔊 Volume control
- 🔐 Secure OAuth authentication

To enable Spotify, follow the [Spotify Setup Guide](SPOTIFY_SETUP.md).
- Auto-refresh every 5 seconds
- Shows session name and duration

## Customization

### Change default duration
Edit `src/components/FocusTracker.tsx`:
```typescript
const [totalDuration, setTotalDuration] = useState(25 * 60); // Change 25 to your value
```

### Change timer options
Edit duration buttons in `FocusTracker.tsx`:
```typescript
{[15, 25, 45, 90].map((minutes) => ...
```

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

## Performance Tips

- Database uses WAL mode for better concurrency
- Indexes on createdAt for fast queries
- Memoization on components to prevent re-renders

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT - Feel free to use this project for personal or commercial use.

## Support

For issues or questions, refer to the code structure and inline documentation.
