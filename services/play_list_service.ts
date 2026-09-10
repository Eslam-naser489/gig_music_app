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
export async function deletePlaylist(id: number) {
  const response = await fetch(`${ApiConfig.baseUrl}/playlists/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!response.ok) {
    throw new Error("Failed to delete playlist");
  }
}
export async function removeTrackFromPlaylist(
  playlistId: string,
  trackId: number,
) {
  const response = await fetch(
    `${ApiConfig.baseUrl}/playlists/${playlistId}/remove_track/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ track_id: trackId }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to remove track");
  }

  return response.json();
}
export async function renamePlaylist(id: number, name: string) {
  const response = await fetch(`${ApiConfig.baseUrl}/playlists/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("Failed to rename playlist");
  return response.json();
}
