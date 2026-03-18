# 🎵 Spotify Integration - Quick Reference Card

## Installation (3 Steps - 7 Minutes)

```bash
# Step 1: Get Client ID (2 min)
# Visit: https://developer.spotify.com/dashboard
# Create app → Copy Client ID → Add redirect: http://localhost:3000

# Step 2: Create .env.local (1 min)
cp .env.example .env.local

# Edit .env.local:
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000

# Step 3: Run (1 min)
npm run dev
# Click "Connect to Spotify" in the app
```

---

## Component Reference

### SpotifyPlayer Component
```tsx
import SpotifyPlayer from '@/components/SpotifyPlayer';

// Usage in FocusTracker.tsx:
<SpotifyPlayer />
```

**Props:** None required
**State Managed:** Internally (auth, search, playback, volume)

---

## Service Reference

### Initialize Spotify
```ts
import { initializeSpotify, getSpotifyService } from '@/lib/spotify';

const config = { 
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
};

const spotify = initializeSpotify(config);
```

### Available Methods

| Method | Params | Returns | Purpose |
|--------|--------|---------|---------|
| `isAuthenticated()` | - | boolean | Check if logged in |
| `getAuthUrl()` | - | string | OAuth redirect URL |
| `handleAuthCallback()` | - | void | Parse & save token |
| `searchTracks(query, limit)` | string, number | Promise | Find songs |
| `getDevices()` | - | Promise | List speakers |
| `play(uri, deviceId, pos)` | string, string, number | Promise | Start playback |
| `pause(deviceId)` | string | Promise | Stop playback |
| `getPlaybackState()` | - | Promise | Current track info |
| `setVolume(percent, deviceId)` | number, string | Promise | Set volume |
| `getPlaylists()` | - | Promise | Get user playlists |
| `logout()` | - | void | Clear token |

---

## API Endpoints Used

```
GET  https://accounts.spotify.com/authorize
     (OAuth login)

POST https://accounts.spotify.com/api/token
     (Not used - Implicit flow)

GET  https://api.spotify.com/v1/search
     (Search tracks)

GET  https://api.spotify.com/v1/me/player/devices
     (List devices)

PUT  https://api.spotify.com/v1/me/player/play
     (Start playback)

PUT  https://api.spotify.com/v1/me/player/pause
     (Pause playback)

GET  https://api.spotify.com/v1/me/player
     (Get playback state)

PUT  https://api.spotify.com/v1/me/player/volume
     (Set volume)

GET  https://api.spotify.com/v1/me/playlists
     (Get playlists)
```

---

## Environment Variables

| Variable | Required | Value | Example |
|----------|----------|-------|---------|
| `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` | ✅ Yes | Spotify app ID | `abc123def456` |
| `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI` | ✅ Yes | Auth redirect URL | `http://localhost:3000` |

**Note:** Both must start with `NEXT_PUBLIC_` to be visible to browser

---

## UI Components

### Connect Button
```tsx
<button onClick={handleLogin}>
  🎵 Connect to Spotify
</button>
```

### Disconnect Button (When Authenticated)
```tsx
<button onClick={handleLogout}>
  🎵 Disconnect ✓ Online
</button>
```

### Search Form
```tsx
<input 
  type="text" 
  placeholder="Search for music..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyPress={(e) => e.key === 'Enter' && searchTracks()}
/>
```

### Device Selector
```tsx
<select value={selectedDevice || ''} onChange={handleDeviceChange}>
  <option value="">Select a device</option>
  {devices.map(d => (
    <option key={d.id} value={d.id}>
      {d.name} ({d.type})
    </option>
  ))}
</select>
```

### Volume Slider
```tsx
<input 
  type="range" 
  min="0" 
  max="100" 
  value={volume}
  onChange={handleVolumeChange}
/>
```

---

## State Structure

```ts
// Component State
{
  isAuthenticated: boolean,      // Logged into Spotify
  isSearching: boolean,          // Search in progress
  searchQuery: string,           // Search input
  tracks: Track[],              // Search results
  devices: Device[],            // Available speakers
  selectedDevice: string | null, // Active device ID
  isPlaying: boolean,           // Currently playing
  currentTrack: Track | null,   // Now playing song
  volume: number,               // 0-100
  error: string | null          // Error message
}

// Track Object
{
  id: string,
  name: string,
  artist: string,
  image: string,
  uri: string
}

// Device Object
{
  id: string,
  name: string,
  type: string,      // "Computer", "Smartphone", "Speaker"
  is_active: boolean // Currently active device
}
```

---

## Common Tasks

### Search for a Song
```ts
const results = await spotify.searchTracks('Focus Music', 10);
// Returns: { tracks: { items: [...] } }
```

### Play a Song
```ts
await spotify.play(trackUri, deviceId);
// trackUri example: 'spotify:track:6rqhFgbbKwnb9MLmUQDvDm'
```

### Change Volume
```ts
await spotify.setVolume(70, deviceId);
// Sets volume to 70%
```

### Get Playing Track
```ts
const state = await spotify.getPlaybackState();
console.log(state.item.name); // Song name
console.log(state.device.name); // Device name
```

### Logout
```ts
spotify.logout();
// Removes token from localStorage
```

---

## Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| Button doesn't show | Check .env.local has NEXT_PUBLIC_SPOTIFY_CLIENT_ID |
| Won't authenticate | Clear browser cache, restart dev server |
| Auth redirects loop | Verify redirect URI matches in Spotify Dashboard |
| Music won't play | Select a device, make sure Spotify app is active |
| No search results | Check authentication, try popular songs |
| Volume doesn't work | Verify device ID is valid and online |

---

## File Locations

```
Root Level:
├── .env.local (← Create this with credentials)
├── .env.example (reference)
├── SPOTIFY_*.md files (documentation)
└── package.json (has spotify-web-api-js)

Source Code:
├── src/lib/spotify.ts (service layer)
├── src/components/SpotifyPlayer.tsx (UI component)
└── src/components/FocusTracker.tsx (main app - contains player)
```

---

## Performance Tips

- Search is debounced to prevent API spam
- Devices are cached after first load
- Token is stored in localStorage for quick reuse
- Volume changes are throttled
- No unnecessary re-renders

---

## Security Checklist

- ✅ Never add Client Secret to code
- ✅ Client ID is safe to expose
- ✅ Use HTTPS in production
- ✅ Don't commit .env.local
- ✅ Tokens are automatically cleared on logout
- ✅ No hardcoded credentials

---

## Testing Checklist

- [ ] Can see "Connect to Spotify" button
- [ ] Can click button and be redirected to Spotify
- [ ] Can log in with Spotify account
- [ ] Redirected back to app automatically
- [ ] Button changes to "Disconnect"
- [ ] Can type in search box
- [ ] Results appear within 1 second
- [ ] Can see album art in results
- [ ] Can select a device
- [ ] Can click play on a track
- [ ] Music plays on selected device
- [ ] Volume slider works
- [ ] Can pause playback
- [ ] Can log out with "Disconnect"

---

## Production Checklist

- [ ] Update NEXT_PUBLIC_SPOTIFY_REDIRECT_URI to production domain
- [ ] Update Redirect URI in Spotify Dashboard
- [ ] Create production .env.production.local
- [ ] Test OAuth on production domain
- [ ] Enable HTTPS/SSL certificate
- [ ] Monitor Spotify API quota usage
- [ ] Set up error logging
- [ ] Test on mobile devices
- [ ] Verify responsive design

---

## Helpful Links

**Spotify Resources:**
- 🔗 [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- 📚 [Web API Documentation](https://developer.spotify.com/documentation/web-api)
- 🔐 [OAuth 2.0 Guide](https://developer.spotify.com/documentation/general/guides/authorization/)

**Project Documentation:**
- 📖 [SPOTIFY_SETUP.md](SPOTIFY_SETUP.md) - Complete guide
- ⚡ [SPOTIFY_QUICKSTART.md](SPOTIFY_QUICKSTART.md) - Fast start
- 🎨 [SPOTIFY_VISUAL_GUIDE.md](SPOTIFY_VISUAL_GUIDE.md) - Diagrams
- 📚 [SPOTIFY_DOCUMENTATION_INDEX.md](SPOTIFY_DOCUMENTATION_INDEX.md) - Navigation

---

## Code Snippets

### Get Current Playing Track
```tsx
const getPlayingTrack = async () => {
  const spotify = getSpotifyService();
  try {
    const state = await spotify.getPlaybackState();
    setCurrentTrack({
      name: state.item.name,
      artist: state.item.artists[0].name,
      image: state.item.album.images[0].url,
      uri: state.item.uri
    });
  } catch (error) {
    setError('Failed to get playing track');
  }
};
```

### Search and Play
```tsx
const searchAndPlay = async (query: string) => {
  const spotify = getSpotifyService();
  try {
    const results = await spotify.searchTracks(query, 1);
    const track = results.tracks.items[0];
    await spotify.play(track.uri, selectedDevice);
  } catch (error) {
    setError('Failed to play track');
  }
};
```

### Handle Device Selection
```tsx
const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setSelectedDevice(e.target.value);
  // Optionally transfer playback
  // spotify.transferPlayback(e.target.value);
};
```

---

## Integration Points

**In FocusTracker.tsx:**
```tsx
import SpotifyPlayer from './SpotifyPlayer';

// Inside JSX:
<motion.div className="space-y-6">
  <Statistics />
  <SpotifyPlayer />  {/* ← Spotify player here */}
</motion.div>
```

---

## Next.js Configuration

No special configuration needed! The Spotify integration works with:
- ✅ Next.js 16.1.7
- ✅ App Router (uses 'use client')
- ✅ React 19.2.3
- ✅ TypeScript 5
- ✅ Tailwind CSS 4

---

**Everything you need to use Spotify integration in one place!** 🎵
