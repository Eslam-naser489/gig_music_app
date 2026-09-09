const BASE_URL = "https://musicapp-production-bcd8.up.railway.app/api";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg4OTY4MTE3LCJpYXQiOjE3ODg5NjQ1MTcsImp0aSI6IjcwYmY0ZWFjZWQ1YzQ3MDQ4N2MwNzcxNzY5NGU1NjBlIiwidXNlcl9pZCI6IjM0In0.NjA35rjzEhdVcxrMkYCn7W7bct3b5D9Z7BA8Il-IKEo";

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