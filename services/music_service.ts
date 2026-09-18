import { Song, Playlist } from '@/types';
import { apiClient } from './apiClient';

// The backend (see Backend Documentation / graduation project spec) returns
// snake_case fields. We normalize them to our app's Song/Playlist shape here
// so the rest of the app never has to know about the raw API format.

function mapTrack(raw: any): Song {
  return {
    id: String(raw.id),
    title: raw.title ?? '',
    artist: raw.artist ?? raw.artist_name ?? '',
    coverUrl: raw.cover_url ?? raw.coverUrl ?? raw.cover ?? '',
    audioUrl: raw.audio_url ?? raw.audioUrl ?? raw.file_url ?? '',
    duration: raw.duration ?? raw.duration_seconds ?? 0,
  };
}

function mapPlaylist(raw: any): Playlist {
  const rawTracks = raw.tracks ?? raw.songs ?? [];
  return {
    id: String(raw.id),
    title: raw.name ?? raw.title ?? '',
    coverUrl: raw.cover_url ?? raw.coverUrl ?? '',
    songs: Array.isArray(rawTracks) ? rawTracks.map(mapTrack) : [],
  };
}

// DRF list endpoints are often paginated ({ results: [...], count, next, previous }),
// but may also return a plain array depending on the ViewSet settings. Handle both.
function extractList(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

const EMPTY_PLAYLIST: Playlist = { id: '', title: '', coverUrl: '', songs: [] };

// Backend endpoints require auth and some (e.g. /playlists/) currently return
// a 500 instead of a clean 401 when called without a valid token, or can be
// temporarily unavailable. We never want a failed request here to crash the
// Home screen, so every function fails soft into an empty result and logs
// the real error for debugging instead of throwing.

export async function getRecommendedSongs(): Promise<Song[]> {
  try {
    const { data } = await apiClient.get('/recommendations/');
    return extractList(data).map(mapTrack);
  } catch (error) {
    console.warn('[music_service] getRecommendedSongs failed:', error);
    return [];
  }
}

export async function getMyPlaylists(): Promise<Playlist[]> {
  try {
    const { data } = await apiClient.get('/playlists/');
    return extractList(data).map(mapPlaylist);
  } catch (error) {
    console.warn('[music_service] getMyPlaylists failed:', error);
    return [];
  }
}

export async function getMyPlaylist(): Promise<Playlist> {
  try {
    const playlists = await getMyPlaylists();
    if (playlists.length === 0) {
      return EMPTY_PLAYLIST;
    }
    // The list endpoint may omit the nested track list for performance,
    // so fetch the detail endpoint for the full playlist with its songs.
    const { data } = await apiClient.get(`/playlists/${playlists[0].id}/`);
    return mapPlaylist(data);
  } catch (error) {
    console.warn('[music_service] getMyPlaylist failed:', error);
    return EMPTY_PLAYLIST;
  }
}

export async function getRecentlyPlayed(): Promise<Song[]> {
  try {
    const { data } = await apiClient.get('/history/');
    return extractList(data).map(mapTrack);
  } catch (error) {
    console.warn('[music_service] getRecentlyPlayed failed:', error);
    return [];
  }
}
