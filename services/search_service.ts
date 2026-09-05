import { SearchResponse, SearchCategoryType, SearchResult, Album } from '@/types';
import { MOCK_SONGS } from './mock/songs';
import { MOCK_ARTISTS } from './mock/artists';
import { MOCK_PLAYLISTS } from './mock/playlists';
import { ApiConfig } from '@/constants/api';

const delay = (min: number, max: number) => {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min)));
};

const checkSignal = (signal?: AbortSignal) => {
  if (signal?.aborted) {
    throw new Error('AbortError');
  }
};

// Helper for generic mock search across types that might contain title, name, or artist fields
const filterItems = <T extends { title?: string; name?: string; artist?: string }>(
  items: T[],
  query: string,
): T[] => {
  const q = query.toLowerCase();
  return items.filter((item) => {
    const matchTitle = item.title?.toLowerCase().includes(q);
    const matchName = item.name?.toLowerCase().includes(q);
    const matchArtist = item.artist?.toLowerCase().includes(q);
    return matchTitle || matchName || matchArtist;
  });
};

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

export async function searchByCategory(
  query: string,
  category: SearchCategoryType,
  signal?: AbortSignal
): Promise<SearchResponse> {
  if (!ApiConfig.useMock) {
    // ADD API ENDPOINT HERE
    throw new Error('Production API not implemented');
  }

  // Simulate network delay
  await delay(200, 400);
  checkSignal(signal);

  const results: SearchResult[] = [];
  const q = query.trim();

  if (!q) {
    return { results: [], query, category, totalCount: 0 };
  }

  if (category === 'all' || category === 'songs') {
    const matched = filterItems(MOCK_SONGS, q);
    results.push(...matched.map((item) => ({ type: 'song' as const, item })));
  }

  if (category === 'all' || category === 'artists') {
    const matched = filterItems(MOCK_ARTISTS, q);
    results.push(...matched.map((item) => ({ type: 'artist' as const, item })));
  }

  if (category === 'all' || category === 'albums') {
    // We don't have mock albums, returning empty for now
    const matched: Album[] = [];
    results.push(...matched.map((item) => ({ type: 'album' as const, item })));
  }

  if (category === 'all' || category === 'playlists') {
    const matched = filterItems(MOCK_PLAYLISTS, q);
    results.push(...matched.map((item) => ({ type: 'playlist' as const, item })));
  }

  // Check again before returning
  checkSignal(signal);

  return {
    results,
    query,
    category,
    totalCount: results.length,
  };
}
