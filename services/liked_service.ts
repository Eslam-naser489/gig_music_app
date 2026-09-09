import { ApiConfig, TOKEN } from "@/constants/api";
export async function getLikedSongs() {
  const response = await fetch(`${ApiConfig.baseUrl}/liked/`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch liked songs");
  }

  return response.json();
}
export async function toggleLikeApi(trackId: number) {
  const response = await fetch(`${ApiConfig.baseUrl}/tracks/${trackId}/like/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to toggle like");
  }

  return response.json();
}
