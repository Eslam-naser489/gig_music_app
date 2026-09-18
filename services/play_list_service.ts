import { apiClient } from './apiClient';

export async function getPlaylistById(id: string) {
  const { data } = await apiClient.get(`/playlists/${id}/`);
  return data;
}

export async function getPlaylists() {
  const { data } = await apiClient.get('/playlists/');
  return data;
}

export async function createPlaylist(name: string) {
  const { data } = await apiClient.post('/playlists/', { name });
  return data;
}

export async function deletePlaylist(id: number) {
  await apiClient.delete(`/playlists/${id}/`);
}

export async function removeTrackFromPlaylist(
  playlistId: string,
  trackId: number,
) {
  const { data } = await apiClient.delete(
    `/playlists/${playlistId}/remove_track/`,
    { track_id: trackId },
  );
  return data;
}

export async function renamePlaylist(id: number, name: string) {
  const { data } = await apiClient.patch(`/playlists/${id}/`, { name });
  return data;
}

export async function addTrackToPlaylist(playlistId: string, trackId: number) {
  const { data } = await apiClient.post(`/playlists/${playlistId}/add_track/`, {
    track_id: trackId,
  });
  return data;
}

export async function getAllTracks() {
  const { data } = await apiClient.get('/tracks/?limit=30');
  return data;
}
