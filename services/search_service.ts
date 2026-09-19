import { SearchResponse, SearchCategoryType, SearchResult } from '@/types';
import { searchTracks } from './music_service';

const checkSignal = (signal?: AbortSignal) => {
  if (signal?.aborted) {
    throw new Error('AbortError');
  }
};

// The backend only exposes a /tracks/ endpoint right now — there's no
// dedicated search API, and no artist/album/playlist search data source
// yet either. So "songs" is real (fetched + filtered client-side via
// music_service.searchTracks), while the other categories return an
// empty list rather than fake/mock data. Extend this once those
// endpoints exist on the backend.
export async function searchByCategory(
  query: string,
  category: SearchCategoryType,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  const q = query.trim();

  if (!q) {
    return { results: [], query, category, totalCount: 0 };
  }

  const results: SearchResult[] = [];

  if (category === 'all' || category === 'songs') {
    const songs = await searchTracks(q);
    checkSignal(signal);
    results.push(...songs.map((item) => ({ type: 'song' as const, item })));
  }

  // artists / albums / playlists: no real backend data source yet.

  checkSignal(signal);

  return {
    results,
    query,
    category,
    totalCount: results.length,
  };
}

export async function searchAll(query: string, signal?: AbortSignal): Promise<SearchResponse> {
  return searchByCategory(query, 'all', signal);
}

export async function searchSongs(query: string, signal?: AbortSignal): Promise<SearchResponse> {
  return searchByCategory(query, 'songs', signal);
}

export async function searchArtists(query: string, signal?: AbortSignal): Promise<SearchResponse> {
  return searchByCategory(query, 'artists', signal);
}

export async function searchAlbums(query: string, signal?: AbortSignal): Promise<SearchResponse> {
  return searchByCategory(query, 'albums', signal);
}

export async function searchPlaylists(query: string, signal?: AbortSignal): Promise<SearchResponse> {
  return searchByCategory(query, 'playlists', signal);
}
