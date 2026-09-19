import SongListItem from "@/components/play_lists/song_list_item";
import { IconButton } from "@/components/ui/icon_button";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/Typography";
import { useLikedSongs } from "@/context/liked_songs_context";
import { useSideMenu } from "@/context/side_menu_context";
import { usePlayer } from "@/hooks/use_player";
import { getLikedSongs } from "@/services/liked_service";
import { mapTrack } from "@/services/music_service";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LikedSongs() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { likedIds, toggleLike, error: contextError } = useLikedSongs();
  const sideMenu = useSideMenu();
  const router = useRouter();
  const { playSong } = usePlayer();

  // Same missing-onPress bug as the playlist screen — tapping a row here
  // did nothing because only the heart icon was wired up (to unlike, not
  // play). Map the raw track and start playback with this list as the
  // queue before navigating, matching Home/Search/Playlist.
  const handleSongPress = (track: any) => {
    const queue = songs.map(mapTrack);
    playSong(mapTrack(track), queue);
    router.push(`/player/${track.id}`);
  };

  useFocusEffect(
    useCallback(() => {
      getLikedSongs()
        .then((data) => setSongs(data))
        .catch(() => setError("فشل تحميل الأغاني"))
        .finally(() => setLoading(false));
    }, []),
  );
  const handleLikePress = (id: number) => {
    toggleLike(id);
    setSongs(songs.filter((s) => s.id !== id));
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <IconButton icon="menu" onPress={() => sideMenu.show()} accessibilityLabel="Open menu" />
        <Text style={{ ...Typography.header, color: Colors.textPrimary }}>Liked Songs</Text>
      </View>
      {loading && <ActivityIndicator size="large" color={Colors.accent} />}
      {error !== "" && (
        <View style={{ padding: 32, alignItems: "center" }}>
          <Text style={{ ...Typography.body, color: Colors.error }}>
            {error}
          </Text>
        </View>
      )}
      {contextError !== "" && (
        <View style={{ padding: 32, alignItems: "center" }}>
          <Text style={{ ...Typography.body, color: Colors.error }}>
            {contextError}
          </Text>
        </View>
      )}
      {!loading && songs.length === 0 && (
        <View style={{ padding: 32, alignItems: "center" }}>
          <Text style={{ ...Typography.body, color: Colors.textSecondary }}>
            مفيش أغاني في المفضلة
          </Text>
        </View>
      )}
      <FlatList
        data={songs}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleSongPress(item)}>
            <SongListItem
              song={item}
              isLiked={likedIds.includes(item.id)}
              onLikePress={() => handleLikePress(item.id)}
            />
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}
