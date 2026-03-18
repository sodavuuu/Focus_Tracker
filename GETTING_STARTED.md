# 🚀 Focus Tracker - Getting Started

## ✅ Project Setup Complete!

Your Focus Tracker application is ready to use. The dev server is running at:

**🌐 http://localhost:3000**

---

## 📖 How to Proceed

### 1. **View the App** (Right Now!)
- Open your browser to **http://localhost:3000**
- You'll see the beautiful Focus Tracker interface
- The app is fully functional and ready to use

### 2. **Start Tracking Focus**
1. Enter a session name (optional)
2. Select duration: 15m, 25m, 45m, or 90m
3. Click "Start Focus"
4. Watch the timer count down
5. Click "Complete" when done

### 3. **View Statistics**
- Top right shows your stats
- Weekly trend chart is available
- Recent sessions list auto-updates

---

## 📚 Documentation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **QUICKSTART.md** | Fast 5-min setup guide | 5 min |
| **README.md** | Complete documentation | 15 min |
| **DEVELOPMENT.md** | Technical deep dive | 20 min |
| **CHANGELOG.md** | Feature & version history | 10 min |
| **PROJECT_SUMMARY.md** | Complete project overview | 10 min |

---

## 🛠️ Development

### Stop/Restart Server
```bash
# Press Ctrl+C in terminal to stop
# Run again to restart
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### View Database
```bash
# Install SQLite CLI if needed
sqlite3 .data/focus-tracker.db

# View all sessions
SELECT * FROM sessions;

# Exit
.quit
```

---

## 🎨 Customization Ideas

### Change Timer Duration (Default: 25 min)
Edit `src/components/FocusTracker.tsx` line ~30:
```typescript
const [totalDuration, setTotalDuration] = useState(25 * 60);
// Change 25 to your preferred minutes
```

### Change Color Scheme
Edit Tailwind classes in components:
- `blue-500` → `purple-500` (for purple theme)
- `slate-900` → `gray-900` (for different dark tone)

### Add Sound Notification
In `src/components/FocusTracker.tsx`, when timer completes:
```typescript
const audio = new Audio('/notification.mp3');
audio.play();
```

---

## 📦 Project Structure

```
focus-tracker/
├── src/
│   ├── app/              # Pages & APIs
│   ├── components/       # React components (FocusTracker, Timer, Stats, etc)
│   ├── lib/             # Database utilities
│   └── types/           # TypeScript types
├── .data/               # Database (auto-created)
├── public/              # Static files
├── package.json         # Dependencies list
├── README.md            # Full docs
├── QUICKSTART.md        # Quick guide
└── DEVELOPMENT.md       # Technical guide
```

---

## 🚀 Deployment

When ready to deploy (skip if not needed):

### Vercel (Easiest)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t focus-tracker .
docker run -p 3000:3000 focus-tracker
```

### Self-hosted
```bash
npm run build
npm start
```

---

## 🐛 If Something Breaks

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Database issues
```bash
rm -r .data/
npm run dev  # Will recreate database
```

### Styles not showing
- Hard refresh browser (Ctrl+Shift+R)
- Check Tailwind classes are spelled correctly

### API errors
- Open DevTools (F12)
- Check Network tab for API responses
- Check browser Console for errors

---

## 🎯 Feature Checklist

- [x] Timer with countdown
- [x] Start/Pause/Complete/Cancel
- [x] Session history
- [x] Statistics dashboard
- [x] Weekly trend chart
- [x] SQLite database
- [x] Beautiful UI
- [x] Responsive design
- [x] Dark mode
- [x] Auto-refresh data

---

## 📝 File Descriptions

### Core App Files
- `src/app/page.tsx` - Home page entry
- `src/components/FocusTracker.tsx` - Main app component
- `src/components/CountdownTimer.tsx` - Timer display
- `src/components/Statistics.tsx` - Stats & charts
- `src/components/SessionHistory.tsx` - Session list

### API Files
- `src/app/api/sessions/start/route.ts` - Start session
- `src/app/api/sessions/end/route.ts` - End session
- `src/app/api/sessions/list/route.ts` - Get sessions
- `src/app/api/stats/daily/route.ts` - Get stats

### Database
- `src/lib/db.ts` - Database setup & initialization

### Types
- `src/types/index.ts` - TypeScript interfaces

---

## 💡 Tips & Tricks

### Using the Timer
1. You can set custom session names
2. Duration buttons update in real-time
3. Pause button keeps timer paused until resumed
4. Complete button marks session as done
5. Cancel discards the session

### Checking Stats
- Stats refresh automatically every 10 seconds
- Weekly chart shows sessions per day
- Average duration calculated automatically
- Total focus time shows in hours/minutes

### Database
- Automatically saves to `.data/focus-tracker.db`
- Persists across server restarts
- Uses SQLite WAL mode for speed
- Indexed for fast queries

---

## 🎓 Learning Resources

If you want to modify the code:

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion
- **Recharts**: https://recharts.org
- **SQLite**: https://www.sqlite.org/docs.html

---

## 🎉 You're All Set!

Your Focus Tracker is ready to use. Here's what you can do:

1. ✅ **Right now**: Open http://localhost:3000
2. ✅ **Today**: Track your first focus session
3. ✅ **This week**: Build a focus streak
4. ✅ **Soon**: Deploy to production

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Stop server | `Ctrl+C` |
| Build prod | `npm run build` |
| Run prod | `npm start` |
| Check lint | `npm run lint` |
| View docs | See files above |

---

## 🌟 What's Next?

After getting comfortable with the app:

1. **Explore the code** - Understand the structure
2. **Try customizations** - Change colors/durations
3. **Add features** - Export data, sounds, themes
4. **Deploy** - Share with others
5. **Extend** - Multi-user, cloud sync, etc.

---

**Happy focusing! 🎯**

For detailed info, see:
- `README.md` - Full documentation
- `DEVELOPMENT.md` - Technical details
- `QUICKSTART.md` - Quick setup
- `PROJECT_SUMMARY.md` - Project overview

Created: March 18, 2026 | Version: 1.0.0 | Status: ✅ Ready
