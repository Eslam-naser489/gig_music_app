import { apiClient } from './apiClient';

export async function getLikedSongs() {
  const { data } = await apiClient.get('/liked/');
  return data;
}

export async function toggleLikeApi(trackId: number) {
  const { data } = await apiClient.post(`/tracks/${trackId}/like/`);
  return data;
}
