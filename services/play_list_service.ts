import { ApiConfig, TOKEN } from "@/constants/api";

export async function getPlaylists() {
 const response = await fetch(`${ApiConfig.baseUrl}/playlists/`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlists");
  }

  return response.json();
}