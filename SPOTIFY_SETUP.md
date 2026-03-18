# Spotify Integration Setup Guide

This guide will help you set up Spotify music integration with the Focus Tracker app, allowing you to play music while tracking your focus sessions.

## Prerequisites

- A Spotify account (free or premium)
- Access to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Node.js and npm (already installed with this project)

## Step-by-Step Setup

### 1. Register Your Application on Spotify Developer

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account (create one if needed - free account works)
3. Accept the terms and create an app:
   - Click **"Create an App"**
   - Enter an app name (e.g., "Focus Tracker")
   - Accept terms and create the app

### 2. Get Your Credentials

1. In your app dashboard, you'll see:
   - **Client ID** - Copy this value
   - **Client Secret** - Keep this private (we don't need it for this implementation)

2. Click **"Edit Settings"**:
   - Under **Redirect URIs**, add: `http://localhost:3000`
   - Click **"Add"** then **"Save"**

### 3. Configure Environment Variables

1. In the project root, create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your credentials:
   ```env
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_actual_client_id_here
   NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000
   ```

3. **Important**: Never commit `.env.local` to git - it's listed in `.gitignore`

### 4. Install Dependencies

The Spotify packages should already be installed. Verify with:

```bash
npm ls spotify-web-api-js axios
```

If not installed, run:

```bash
npm install spotify-web-api-js axios
```

### 5. Restart Development Server

```bash
npm run dev
# or
npm run dev:win  # on Windows
```

Visit `http://localhost:3000` in your browser.

## Using Spotify in Focus Tracker

### Authentication

1. You'll see the Spotify Player widget in the right sidebar
2. Click **"Connect to Spotify"** button
3. You'll be redirected to Spotify login
4. Authorize the app to access your Spotify account
5. You'll be redirected back to Focus Tracker

### Playing Music

1. **Search for music**: Type a song or artist name in the search box
2. **View results**: Up to 10 matching tracks will appear with album art
3. **Select a device**: Choose where to play music (phone, computer, etc.)
4. **Play a track**: Click on any track to start playback
5. **Control playback**: Use play/pause buttons and volume slider

### Features

- 🎵 **Search**: Find any song, artist, or album in Spotify's catalog
- 🎧 **Device Selection**: Choose which device plays the music
- ⏯️ **Playback Controls**: Play, pause, and resume tracks
- 🔊 **Volume Control**: Adjust volume with the slider
- 📱 **Real-time**: Music plays across all your Spotify devices

## Troubleshooting

### "Connect to Spotify" button doesn't work

**Solution**: Verify your credentials in `.env.local`:
- Check that `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` is not empty
- Ensure redirect URI is registered in Spotify Developer Dashboard
- Restart the dev server after updating environment variables

### Authentication redirects but doesn't log in

**Solution**:
1. Clear browser cache and cookies
2. Make sure you're using the correct Spotify account
3. Check that the app is approved in Spotify Developer Dashboard settings

### Search doesn't return results

**Solution**:
- Make sure you're authenticated first (see blue "Disconnect" button)
- Try searching for popular artists or songs
- Check browser console for error messages (F12 → Console tab)

### Music won't play

**Solution**:
1. Select a device from the device dropdown
2. Make sure that device is online and connected to Spotify
3. Check that Spotify is installed/active on the selected device
4. Verify that your Spotify account has permission to play music

### Environment variables not recognized

**Solution**:
- Files should be named `.env.local` (not `.env` or `.env.development`)
- Restart dev server after creating/updating `.env.local`
- Variables must start with `NEXT_PUBLIC_` to be exposed to browser

## Advanced Configuration

### Changing Redirect URI for Production

If deploying to production, update both:

1. `.env.production.local`:
   ```env
   NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://yourdomain.com
   ```

2. Spotify Developer Dashboard settings:
   - Add your production URL to Redirect URIs
   - Save changes

### OAuth Scope Details

The current implementation requests basic permissions:
- `streaming` - Play music on devices
- `user-read-private` - Read account info
- `user-read-email` - Read email address

These are configured in `src/lib/spotify.ts`. Modify if you need different permissions.

## Security Notes

- ✅ Client ID is safe to expose (starts with `NEXT_PUBLIC_`)
- ❌ Never share your Client Secret
- ✅ Tokens are stored in browser localStorage (cleared on logout)
- ⚠️ Use HTTPS in production for secure token transmission

## Support & Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [OAuth 2.0 Guide](https://developer.spotify.com/documentation/general/guides/authorization/)
- [Interactive API Console](https://developer.spotify.com/console)

## Next Steps

1. Try playing music during a focus session
2. Customize your focus playlist on Spotify
3. Use Spotify's offline feature for uninterrupted focus
4. Create playlists optimized for concentration

---

**Enjoy focused music sessions! 🎵**
