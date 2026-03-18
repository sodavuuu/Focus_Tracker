# 🎵 Spotify Integration Quick Start

## Setup in 3 Steps

### Step 1: Get Spotify Client ID (2 min)
```
1. Visit: https://developer.spotify.com/dashboard
2. Login or create free Spotify account
3. Click "Create an App"
4. Name it "Focus Tracker"
5. Accept terms and create
6. Copy your Client ID (starts with letters)
```

### Step 2: Configure Redirect URI (1 min)
```
1. In your app settings, click "Edit Settings"
2. Under "Redirect URIs" add:
   http://localhost:3000
3. Click "Add" then "Save"
```

### Step 3: Create .env.local (1 min)
```bash
# In project root, create .env.local
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_from_step_1
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000
```

**Done!** Start the app and click "Connect to Spotify" 🚀

---

## Using the Player

1. **Search** - Type song/artist name
2. **Select Device** - Pick where music plays
3. **Play** - Click track to start
4. **Control** - Use play/pause buttons
5. **Volume** - Adjust slider (0-100%)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Button doesn't work | Check `.env.local` has correct Client ID |
| Won't play | Select a device from dropdown |
| Auth redirect fails | Clear browser cache, restart dev server |
| Search returns nothing | Try popular songs (e.g., "Shape of You") |
| No environment variables | Restart dev server after creating `.env.local` |

---

## Full Documentation

👉 See [SPOTIFY_SETUP.md](SPOTIFY_SETUP.md) for complete guide

---

**Status:** ✅ Ready to use
