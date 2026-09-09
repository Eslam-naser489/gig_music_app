const BASE_URL = "https://musicapp-production-bcd8.up.railway.app/api";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg4OTY5ODE1LCJpYXQiOjE3ODg5NjYyMTUsImp0aSI6IjQzZDMxOGY0MDdjMDRkYjI5NGEyZDBhMDczNzNmMWVhIiwidXNlcl9pZCI6IjM0In0.ZWXL0_HbQYKt0Ac1Z0qaJIC6pa-IWwbwhYBtPL_rUPw";

export async function getLikedSongs() {
  const response = await fetch(`${BASE_URL}/liked/`, {
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
  const response = await fetch(`${BASE_URL}/tracks/${trackId}/like/`, {
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
