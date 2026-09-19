import { Song, Playlist } from '@/types';
import { apiClient } from './apiClient';

// The backend (see Backend Documentation / graduation project spec) returns
// snake_case fields. We normalize them to our app's Song/Playlist shape here
// so the rest of the app never has to know about the raw API format.

// The backend builds `stream_url` as an absolute link using the request's
// scheme, but behind Railway's proxy it comes back as `http://` even though
// the API itself is only reachable over `https://` (see ApiConfig.baseUrl).
// On web this is silently blocked as mixed content once the app runs on
// https, and on native it can hit Android's cleartext-traffic block — the
// symptom in both cases is "nothing happens" when you press play, not a
// visible error. Forcing https here (same host, same working TLS) fixes it.
function toHttps(url: string): string {
  return url.startsWith('http://') ? 'https://' + url.slice('http://'.length) : url;
}

export function mapTrack(raw: any): Song {
  const rawAudioUrl = raw.stream_url ?? raw.audio_url ?? raw.audioUrl ?? raw.file_url ?? '';
  return {
    id: String(raw.id),
    title: raw.title ?? '',
    artist: raw.artist ?? raw.artist_name ?? '',
    coverUrl: raw.cover_url ?? raw.coverUrl ?? raw.cover ?? '',
    // The backend's actual field is `stream_url` (a proxy endpoint —
    // /api/tracks/<id>/stream/ — not a direct file link). Keep the other
    // names as fallbacks in case a different endpoint ever returns one of
    // those instead.
    audioUrl: rawAudioUrl ? toHttps(rawAudioUrl) : '',
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
export function extractList(data: any): any[] {
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

// There's no dedicated /search/ endpoint on the backend yet, so search
// works by fetching a working set of tracks and filtering client-side by
// title/artist. Swap this for a real `?search=` query once the backend
// adds one — the Song[] contract this returns won't need to change.
export async function searchTracks(query: string): Promise<Song[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  try {
    const { data } = await apiClient.get('/tracks/?limit=100');
    const all = extractList(data).map(mapTrack);
    return all.filter(
      (song) => song.title.toLowerCase().includes(q) || song.artist.toLowerCase().includes(q),
    );
  } catch (error) {
    console.warn('[music_service] searchTracks failed:', error);
    return [];
  }
}
