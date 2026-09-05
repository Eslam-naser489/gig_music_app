// types/index.ts
// ⚠️ ملف مشترك — العضو الخامس مسؤول عن النسخة النهائية منه.
// دي نسخة مبدئية كافية عشان العضو التاني (والرابع) يبدأوا الشغل من غير انتظار.

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number; // بالثواني
}

export interface Playlist {
  id: string;
  title: string;
  coverUrl: string;
  songs: Song[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genre?: string;
  songCount?: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year?: number;
  songCount?: number;
}

export type SearchCategoryType = 'all' | 'songs' | 'artists' | 'albums' | 'playlists';

export interface SearchResult {
  type: 'song' | 'artist' | 'album' | 'playlist';
  item: Song | Artist | Album | Playlist;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  category: SearchCategoryType;
  totalCount: number;
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
}
