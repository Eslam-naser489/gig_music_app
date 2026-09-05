import { Song, Playlist } from '@/types';
import { MOCK_SONGS } from './mock/songs';
import { MOCK_PLAYLISTS } from './mock/playlists';

const delay = (min: number, max: number) => {
  return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min)));
};

export async function getRecommendedSongs(): Promise<Song[]> {
  await delay(300, 500);
  return [...MOCK_SONGS];
}

export async function getMyPlaylist(): Promise<Playlist> {
  await delay(300, 500);
  return MOCK_PLAYLISTS[0];
}

export async function getMyPlaylists(): Promise<Playlist[]> {
  await delay(300, 500);
  return [...MOCK_PLAYLISTS];
}

export async function getRecentlyPlayed(): Promise<Song[]> {
  await delay(300, 500);
  // Return a subset of songs for recently played
  return MOCK_SONGS.slice(2, 7);
}
