import { LikedSongsProvider } from "@/context/liked_songs_context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <LikedSongsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LikedSongsProvider>
  );
}
