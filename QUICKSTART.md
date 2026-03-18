# Quick Start Guide - Focus Tracker

## 🚀 5-Minute Setup

### 1. Clone & Install
```bash
cd focus-tracker
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Open [http://localhost:3000](http://localhost:3000)

## 🎯 Using the App

### Start Your First Session
1. Type a session name (optional) - e.g., "Code Review"
2. Click one of the preset durations: **15m**, **25m**, **45m**, or **90m**
3. Click **Start Focus** button
4. The timer will count down automatically

### During a Session
- **Pause** - Temporarily pause the timer
- **Complete** - Mark session as done (saves to history)
- **Cancel** - Stop without saving

### View Your Progress
- **Top Right Stats** - Total sessions, focus time, and averages
- **Weekly Chart** - Visual trend of your focus sessions
- **Recent Sessions** - List of completed sessions

## 📊 Data & Database

All sessions are automatically saved to SQLite database:
- Location: `.data/focus-tracker.db`
- Auto-created on first run
- Persistent across restarts

## 🔧 Development

### Project Structure
```
src/
├── app/              # Pages & API routes
├── components/       # UI components (React)
├── lib/             # Database utilities
└── types/           # TypeScript types
```

### Useful Commands
```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Run production server

# Code quality
npm run lint         # Check code with ESLint
```

### Customization

#### Change Timer Duration
Edit `src/components/FocusTracker.tsx`:
```typescript
const [totalDuration, setTotalDuration] = useState(25 * 60); // 25 minutes
```

#### Change Timer Presets
Edit the duration buttons:
```typescript
{[15, 25, 45, 90].map((minutes) => ...
// Change to: {[10, 20, 30, 60].map(...
```

#### Change Colors
Edit Tailwind classes in components:
```typescript
// Blue primary color
className="bg-blue-500"

// Change to purple
className="bg-purple-500"
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Heroku
```bash
heroku create focus-tracker
git push heroku main
```

### Deploy to Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Run:
```bash
docker build -t focus-tracker .
docker run -p 3000:3000 focus-tracker
```

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Database errors
```bash
# Delete and recreate database
rm -r .data/
npm run dev
```

### Slow performance
- Check database: `sqlite3 .data/focus-tracker.db ".tables"`
- Clear browser cache
- Close unnecessary browser tabs

## 📱 Features Breakdown

### Timer Display
- **Circular progress** - Visual indicator of completion
- **Minutes:Seconds format** - Easy to read countdown
- **Percentage** - Shows completion percentage

### Statistics
- **Total Sessions** - Count of all completed sessions
- **Total Focus Time** - Sum of all session durations
- **Average Duration** - Mean time per session
- **Weekly Trend** - Line chart of sessions per day

### Session History
- **Recent list** - Last 30+ sessions
- **Auto-refresh** - Updates every 5 seconds
- **Time display** - Shows when session was completed

## 🎨 Customization Ideas

### Add Sounds
```javascript
// Add notification sound when timer completes
const audio = new Audio('/notification.mp3');
audio.play();
```

### Add Break Timer
```javascript
// After focus session, auto-start 5-minute break
const breakDuration = 5 * 60;
setTotalDuration(breakDuration);
```

### Export Data
```javascript
// Export sessions as CSV or JSON
const json = JSON.stringify(sessions);
const blob = new Blob([json], { type: 'application/json' });
```

### Dark/Light Mode Toggle
```javascript
// Add theme toggle button
const [isDark, setIsDark] = useState(true);
// Update Tailwind classes based on theme
```

## 📚 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org)
- [SQLite Docs](https://www.sqlite.org/docs.html)

## 🤝 Contributing

Feel free to:
- Add new features
- Fix bugs
- Improve documentation
- Optimize performance

## 📝 License

MIT - Use freely for personal and commercial projects

---

**Need help?** Check `DEVELOPMENT.md` for deeper technical details.