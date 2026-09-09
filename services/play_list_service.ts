const BASE_URL = "https://musicapp-production-bcd8.up.railway.app/api";
const TOKEN = "...";

export async function getPlaylists() {
  const response = await fetch(`${BASE_URL}/playlists/`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlists");
  }

  return response.json();
}