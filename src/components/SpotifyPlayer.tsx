'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSpotifyService, initializeSpotify } from '@/lib/spotify';

interface Track {
  id: string;
  name: string;
  artist: string;
  image: string;
  uri: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
}

export default function SpotifyPlayer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('focus music');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(70);
  const [error, setError] = useState<string | null>(null);

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'http://localhost:3000';

  // Initialize Spotify on mount
  useEffect(() => {
    if (clientId) {
      const spotify = initializeSpotify({ clientId, redirectUri });
      setIsAuthenticated(spotify.isAuthenticated());
      
      if (spotify.isAuthenticated()) {
        loadDevices();
      }
    }
  }, [clientId]);

  const handleLogin = () => {
    if (clientId) {
      const spotify = initializeSpotify({ clientId, redirectUri });
      window.location.href = spotify.getAuthUrl();
    }
  };

  const handleLogout = () => {
    const spotify = getSpotifyService();
    if (spotify) {
      spotify.logout();
      setIsAuthenticated(false);
      setTracks([]);
      setDevices([]);
      setCurrentTrack(null);
      setError(null);
    }
  };

  const loadDevices = async () => {
    try {
      const spotify = getSpotifyService();
      if (!spotify) return;

      const response = await spotify.getDevices();
      setDevices(response.devices || []);
      
      // Select first active device or first available
      const activeDevice = response.devices?.find((d: Device) => d.is_active);
      if (activeDevice) {
        setSelectedDevice(activeDevice.id);
      } else if (response.devices?.length > 0) {
        setSelectedDevice(response.devices[0].id);
      }
    } catch (err) {
      setError('Failed to load devices');
      console.error(err);
    }
  };

  const searchTracks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const spotify = getSpotifyService();
      if (!spotify) return;

      const response = await spotify.searchTracks(searchQuery, 10);
      const formattedTracks = (response.tracks?.items || []).map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name || 'Unknown',
        image: track.album?.images[0]?.url || '/placeholder.png',
        uri: track.uri
      }));
      setTracks(formattedTracks);
    } catch (err) {
      setError('Failed to search tracks');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const playTrack = async (track: Track) => {
    try {
      const spotify = getSpotifyService();
      if (!spotify || !selectedDevice) return;

      await spotify.play(track.uri, selectedDevice);
      setCurrentTrack(track);
      setIsPlaying(true);
      setError(null);
    } catch (err) {
      setError('Failed to play track');
      console.error(err);
    }
  };

  const togglePlayback = async () => {
    try {
      const spotify = getSpotifyService();
      if (!spotify || !selectedDevice) return;

      if (isPlaying) {
        await spotify.pause(selectedDevice);
        setIsPlaying(false);
      } else {
        await spotify.play(undefined, selectedDevice);
        setIsPlaying(true);
      }
      setError(null);
    } catch (err) {
      setError('Failed to toggle playback');
      console.error(err);
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    setVolume(newVolume);
    try {
      const spotify = getSpotifyService();
      if (!spotify || !selectedDevice) return;

      await spotify.setVolume(newVolume, selectedDevice);
    } catch (err) {
      console.error('Failed to set volume:', err);
    }
  };

  if (!clientId) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
        <p className="text-red-400 text-sm">
          ⚠️ Spotify Client ID not configured. See setup guide.
        </p>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎵</span>
          <h3 className="text-lg font-semibold text-white">Spotify Music</h3>
        </div>
        {isAuthenticated && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="text-sm px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition"
          >
            Logout
          </motion.button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
          {error}
        </div>
      )}

      {!isAuthenticated ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-green-500/50 transition"
        >
          🎵 Connect to Spotify
        </motion.button>
      ) : (
        <div className="space-y-4">
          {/* Device Selector */}
          {devices.length > 0 && (
            <select
              value={selectedDevice || ''}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-green-400"
            >
              <option value="">Select Device...</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name} ({device.type})
                </option>
              ))}
            </select>
          )}

          {/* Search */}
          <form onSubmit={searchTracks} className="flex gap-2">
            <input
              type="text"
              placeholder="Search tracks... (e.g., focus music)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-green-400"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition disabled:opacity-50"
            >
              {isSearching ? '⏳' : '🔍'}
            </motion.button>
          </form>

          {/* Current Playing */}
          {currentTrack && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
            >
              <p className="text-xs text-green-300 mb-1">Now Playing</p>
              <p className="text-sm font-medium text-white">{currentTrack.name}</p>
              <p className="text-xs text-slate-400">{currentTrack.artist}</p>
            </motion.div>
          )}

          {/* Playback Controls */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayback}
              disabled={!selectedDevice}
              className="flex-1 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 font-medium hover:bg-green-500/30 transition disabled:opacity-50"
            >
              {isPlaying ? '⏸ Pause' : '▶ Resume'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadDevices}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-slate-300 font-medium hover:bg-white/20 transition"
            >
              🔄
            </motion.button>
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">Volume</label>
              <span className="text-sm text-slate-400">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          {/* Tracks List */}
          {tracks.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <p className="text-xs text-slate-400 font-semibold">Found {tracks.length} tracks</p>
              {tracks.map((track) => (
                <motion.button
                  key={track.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => playTrack(track)}
                  className="w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition flex gap-3 items-center"
                >
                  {track.image && (
                    <img
                      src={track.image}
                      alt={track.name}
                      className="w-10 h-10 rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{track.name}</p>
                    <p className="text-xs text-slate-400 truncate">{track.artist}</p>
                  </div>
                  <span className="text-lg">▶</span>
                </motion.button>
              ))}
            </div>
          )}

          {tracks.length === 0 && !isSearching && (
            <p className="text-center text-sm text-slate-400 py-4">
              Search for tracks to get started
            </p>
          )}
        </div>
      )}
    </div>
  );
}
