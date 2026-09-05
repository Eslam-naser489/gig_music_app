export const Routes = {
  home: '/(tabs)/home' as const,
  search: '/search' as const,
  player: (songId: string) => `/player/${songId}` as const,
  playlist: (playlistId: string) => `/playlists/${playlistId}` as const,
  likedSongs: '/(tabs)/liked_songs' as const,
  playlists: '/(tabs)/play_list' as const,
};
