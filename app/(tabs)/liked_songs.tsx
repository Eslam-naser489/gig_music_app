import SongListItem from "@/components/play_lists/song_list_item";
import { useLikedSongs } from "@/context/liked_songs_context";
import { getLikedSongs } from "@/services/liked_service";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, Text } from "react-native";

export default function LikedSongs() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { likedIds, toggleLike } = useLikedSongs();

  useEffect(() => {
    getLikedSongs()
      .then((data) => setSongs(data))
      .catch(() => setError("فشل تحميل الأغاني"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView>
      {loading && <ActivityIndicator size="large" />}
      {error !== "" && <Text>{error}</Text>}
      {!loading && songs.length === 0 && <Text>مفيش أغاني في المفضلة</Text>}
      <FlatList
        data={songs}
        renderItem={({ item }) => (
          <SongListItem
            song={item}
            isLiked={likedIds.includes(item.id)}
            onLikePress={() => toggleLike(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}
