// app/_layout.tsx
import MiniPlayer from "@/components/player/mini_player";
import { AuthProvider } from "@/context/auth_context";
import { PlayerProvider } from "@/context/player_context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PlayerProvider>
          <View style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }} />
            <MiniPlayer />
          </View>
        </PlayerProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
