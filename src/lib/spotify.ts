/**
 * Spotify Web API Integration Service
 * Handles authentication and playback control
 */

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export interface SpotifyAuthConfig {
  clientId: string;
  redirectUri: string;
}

export class SpotifyService {
  private accessToken: string | null = null;
  private clientId: string;
  private redirectUri: string;

  constructor(config: SpotifyAuthConfig) {
    this.clientId = config.clientId;
    this.redirectUri = config.redirectUri;
    
    // Check for token in URL hash (callback)
    this.handleAuthCallback();
  }

  /**
   * Generate authorization URL for user login
   */
  getAuthUrl(): string {
    const scopes = [
      'streaming',
      'user-read-private',
      'user-read-email',
      'user-library-read',
      'user-library-modify',
      'user-read-playback-state',
      'user-modify-playback-state',
      'playlist-read-private'
    ];

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'token',
      redirect_uri: this.redirectUri,
      scope: scopes.join(' ')
    });

    return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
  }

  /**
   * Handle OAuth callback and extract access token
   */
  private handleAuthCallback() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');

    if (token) {
      this.accessToken = token;
      localStorage.setItem('spotify_token', token);
      window.location.hash = '';
    } else {
      const stored = localStorage.getItem('spotify_token');
      if (stored) {
        this.accessToken = stored;
      }
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  /**
   * Get current access token
   */
  getToken(): string | null {
    return this.accessToken;
  }

  /**
   * Logout from Spotify
   */
  logout() {
    this.accessToken = null;
    localStorage.removeItem('spotify_token');
  }

  /**
   * Search for tracks on Spotify
   */
  async searchTracks(query: string, limit = 10) {
    if (!this.accessToken) throw new Error('Not authenticated');

    const response = await fetch(
      `${SPOTIFY_API_URL}/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    );

    if (!response.ok) throw new Error('Failed to search tracks');
    return response.json();
  }

  /**
   * Get available devices for playback
   */
  async getDevices() {
    if (!this.accessToken) throw new Error('Not authenticated');

    const response = await fetch(`${SPOTIFY_API_URL}/me/player/devices`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) throw new Error('Failed to get devices');
    return response.json();
  }

  /**
   * Start playback of track(s)
   */
  async play(
    trackUri?: string,
    deviceId?: string,
    positionMs?: number
  ) {
    if (!this.accessToken) throw new Error('Not authenticated');

    const body: any = {};
    if (trackUri) body.uris = [trackUri];
    if (positionMs) body.position_ms = positionMs;

    const url = deviceId
      ? `${SPOTIFY_API_URL}/me/player/play?device_id=${deviceId}`
      : `${SPOTIFY_API_URL}/me/player/play`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error('Failed to start playback');
  }

  /**
   * Pause playback
   */
  async pause(deviceId?: string) {
    if (!this.accessToken) throw new Error('Not authenticated');

    const url = deviceId
      ? `${SPOTIFY_API_URL}/me/player/pause?device_id=${deviceId}`
      : `${SPOTIFY_API_URL}/me/player/pause`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) throw new Error('Failed to pause playback');
  }

  /**
   * Get current playback state
   */
  async getPlaybackState() {
    if (!this.accessToken) throw new Error('Not authenticated');

    const response = await fetch(`${SPOTIFY_API_URL}/me/player`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) throw new Error('Failed to get playback state');
    return response.json();
  }

  /**
   * Set volume
   */
  async setVolume(volumePercent: number, deviceId?: string) {
    if (!this.accessToken) throw new Error('Not authenticated');

    const url = deviceId
      ? `${SPOTIFY_API_URL}/me/player/volume?volume_percent=${volumePercent}&device_id=${deviceId}`
      : `${SPOTIFY_API_URL}/me/player/volume?volume_percent=${volumePercent}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) throw new Error('Failed to set volume');
  }

  /**
   * Get user's playlists
   */
  async getPlaylists() {
    if (!this.accessToken) throw new Error('Not authenticated');

    const response = await fetch(`${SPOTIFY_API_URL}/me/playlists`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) throw new Error('Failed to get playlists');
    return response.json();
  }
}

// Create singleton instance
let spotifyService: SpotifyService | null = null;

export function initializeSpotify(config: SpotifyAuthConfig): SpotifyService {
  if (!spotifyService) {
    spotifyService = new SpotifyService(config);
  }
  return spotifyService;
}

export function getSpotifyService(): SpotifyService | null {
  return spotifyService;
}
