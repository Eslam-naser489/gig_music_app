import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/context/AuthContext";
import { LikedSongsProvider } from "@/context/liked_songs_context";
import { ThemeProvider } from "@/context/theme_context";
import { SideMenuProvider } from "@/context/side_menu_context";
import { PlayerProvider } from "@/context/player_context";
import { SideMenu } from "@/components/layout/side_menu";
import MiniPlayer from "@/components/player/mini_player";

/**
 * Root layout — owned by the Infrastructure & Layout member.
 * Wires the app-wide providers (safe area, gesture handler, auth,
 * liked songs, theme, side menu, player) and mounts the global Side
 * Menu and Mini Player once so any screen can open the menu via
 * `useSideMenu().show()` and playback keeps running/visible across
 * screens. Settings / Contact Us / Learn More present as modals,
 * matching the side-menu entry points.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <LikedSongsProvider>
            <ThemeProvider>
              <SideMenuProvider>
                <PlayerProvider>
                  <StatusBar style="dark" />
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="setting" options={{ presentation: "modal" }} />
                    <Stack.Screen name="contact_us" options={{ presentation: "modal" }} />
                    <Stack.Screen name="learn_more" options={{ presentation: "modal" }} />
                  </Stack>
                  <SideMenu />
                  <MiniPlayer />
                </PlayerProvider>
              </SideMenuProvider>
            </ThemeProvider>
          </LikedSongsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
