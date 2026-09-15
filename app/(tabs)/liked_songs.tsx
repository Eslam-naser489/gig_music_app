import SongListItem from "@/components/play_lists/song_list_item";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/Typography";
import { useLikedSongs } from "@/context/liked_songs_context";
import { getLikedSongs } from "@/services/liked_service";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LikedSongs() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { likedIds, toggleLike, error: contextError } = useLikedSongs();

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
      <Text
        style={{ ...Typography.header, color: Colors.textPrimary, padding: 16 }}
      >
        Liked Songs
      </Text>
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
          <SongListItem
            song={item}
            isLiked={likedIds.includes(item.id)}
            onLikePress={() => handleLikePress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}
