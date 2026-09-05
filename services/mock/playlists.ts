import { Playlist } from '@/types';
import { MOCK_SONGS } from './songs';

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-1',
    title: 'Global Top 50',
    coverUrl: 'https://picsum.photos/seed/GlobalTop50/300',
    songs: MOCK_SONGS.slice(0, 5),
  },
  {
    id: 'playlist-2',
    title: 'Rock Classics',
    coverUrl: 'https://picsum.photos/seed/RockClassics/300',
    songs: [MOCK_SONGS[2], MOCK_SONGS[5], MOCK_SONGS[6], MOCK_SONGS[8]],
  },
  {
    id: 'playlist-3',
    title: 'Pop Anthems',
    coverUrl: 'https://picsum.photos/seed/PopAnthems/300',
    songs: [MOCK_SONGS[0], MOCK_SONGS[1], MOCK_SONGS[3]],
  },
  {
    id: 'playlist-4',
    title: 'Soulful Ballads',
    coverUrl: 'https://picsum.photos/seed/SoulfulBallads/300',
    songs: [MOCK_SONGS[4], MOCK_SONGS[9]],
  },
];
