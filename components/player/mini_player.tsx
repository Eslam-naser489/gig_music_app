// components/player/mini_player.tsx
import { usePlayer } from "@/hooks/use_player";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Screens where the mini player should NOT appear
const HIDDEN_ROUTES = [
  "/player",
  "/welcome",
  "/login",
  "/sign_in",
  "/sign_up",
  "/signup",
  "/onboarding",
];

// Screens that render the custom bottom tab bar (see app/(tabs)/_layout.tsx
// + components/layout/bottom_navigation.tsx). The mini player is mounted
// globally in the root layout and has no idea that bar exists, so on these
// routes it needs extra bottom offset or it floats on top of/over the tabs.
const TAB_BAR_ROUTES = ["/home", "/search", "/liked_songs", "/play_list"];

// Rough rendered height of BottomNavigation, excluding the safe-area inset
// (which is added separately below): paddingTop(8) + icon tile(32) +
// gap(4) + label text(~14) + border(1) + its own extra paddingBottom(4).
const TAB_BAR_HEIGHT = 63;

export default function MiniPlayer() {
  const { currentSong, isPlaying, position, duration, togglePlay, next } =
    usePlayer();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const hidden =
    HIDDEN_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname === "/";
  if (!currentSong || hidden) return null;

  const onTabBarScreen = TAB_BAR_ROUTES.some((route) => pathname.startsWith(route));
  const bottomOffset = insets.bottom + 8 + (onTabBarScreen ? TAB_BAR_HEIGHT : 0);

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

  return (
    <Pressable
      style={[styles.container, { bottom: bottomOffset }]}
      onPress={() => router.push(`/player/${currentSong.id}`)}
      accessibilityLabel="Open now playing"
    >
      <View style={styles.row}>
        <Image source={{ uri: currentSong.coverUrl }} style={styles.cover} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>
        <Pressable
          onPress={togglePlay}
          hitSlop={10}
          accessibilityLabel={isPlaying ? "Pause" : "Play"}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={26}
            color="#fff"
          />
        </Pressable>
        <Pressable
          onPress={next}
          hitSlop={10}
          style={styles.nextBtn}
          accessibilityLabel="Next"
        >
          <Ionicons name="play-skip-forward" size={22} color="#fff" />
        </Pressable>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 12,
    right: 12,
    backgroundColor: "#171827",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  row: { flexDirection: "row", alignItems: "center", padding: 10 },
  cover: { width: 44, height: 44, borderRadius: 8, backgroundColor: "#333" },
  info: { flex: 1, marginHorizontal: 12 },
  title: { color: "#fff", fontSize: 14, fontWeight: "600" },
  artist: { color: "#aaa", fontSize: 12, marginTop: 2 },
  nextBtn: { marginLeft: 16 },
  track: { height: 3, backgroundColor: "#333" },
  fill: { height: 3, backgroundColor: "#FF5A3C" },
});
