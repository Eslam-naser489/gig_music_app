import { ApiConfig, TOKEN } from "@/constants/api";

export async function getPlaylistById(id: string) {
  const response = await fetch(`${ApiConfig.baseUrl}/playlists/${id}/`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlist");
  }

  return response.json();
}
export async function getPlaylists() {
  const response = await fetch(`${ApiConfig.baseUrl}/playlists/`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlists");
  }

  return response.json();
}
export async function createPlaylist(name: string) {
  const response = await fetch(`${ApiConfig.baseUrl}/playlists/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to create playlist");
  }

  return response.json();
}