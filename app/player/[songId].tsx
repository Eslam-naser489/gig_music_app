// app/player/[songId].tsx
import PlayerControls from "@/components/player/player_controls";
import ProgressBar from "@/components/player/progress_bar";
import { usePlayer } from "@/hooks/use_player";
import { getRecommendedSongs } from "@/services/music_service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NowPlayingScreen() {
  const { songId } = useLocalSearchParams<{ songId: string }>();
  const router = useRouter();
  const { currentSong, position, duration, error, playSong, seekTo } =
    usePlayer();

  const [loading, setLoading] = useState(currentSong?.id !== songId);
  const [notFound, setNotFound] = useState(false);

  // Start the song from the URL only when the screen opens
  useEffect(() => {
    if (!songId || currentSong?.id === songId) return;
    let active = true;
    getRecommendedSongs()
      .then((songs) => {
        if (!active) return;
        const song = songs.find((s) => s.id === songId);
        if (song) playSong(song, songs);
        else setNotFound(true);
      })
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [songId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF5A3C" />
      </View>
    );
  }

  if (notFound || !currentSong) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Song not found</Text>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/home"))}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/home"))}
          hitSlop={10}
        >
          <Ionicons name="chevron-down" size={28} color="#171827" />
        </Pressable>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <View style={{ width: 28 }} />
      </View>

      <Image source={{ uri: currentSong.coverUrl }} style={styles.cover} />

      <Text style={styles.title} numberOfLines={1}>
        {currentSong.title}
      </Text>
      <Text style={styles.artist} numberOfLines={1}>
        {currentSong.artist}
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.progress}>
        <ProgressBar position={position} duration={duration} onSeek={seekTo} />
      </View>

      <PlayerControls />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // maxWidth + alignSelf keep this from blowing up to full window width on
  // web/desktop browsers ("100%" on native just means "fill the phone
  // screen", but on a wide browser window it means the actual window width).
  container: {
    flex: 1,
    backgroundColor: "#FAF9FC",
    paddingHorizontal: 24,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF9FC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#171827" },
  cover: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    marginTop: 16,
    backgroundColor: "#FBE9E4",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#171827", marginTop: 28 },
  artist: { fontSize: 16, color: "#888", marginTop: 4 },
  error: { color: "#E8412D", marginTop: 8, fontSize: 13 },
  progress: { marginTop: 28, marginBottom: 20 },
  message: { fontSize: 16, color: "#171827", marginBottom: 12 },
  link: { color: "#FF5A3C", fontSize: 16, fontWeight: "600" },
});
