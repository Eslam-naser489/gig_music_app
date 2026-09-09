import SongListItem from "@/components/play_lists/song_list_item";
import { getPlaylistById } from "@/services/play_list_service";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, Text } from "react-native";
export default function PlaylistDetail() {
  const { playlListId } = useLocalSearchParams();
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    getPlaylistById(playlListId as string)
      .then((data) => setPlaylist(data))
      .catch(() => setError("فشل تحميل قائمة التشغيل"))
      .finally(() => setLoading(false));
  }, [playlListId]);
  return (
    <SafeAreaView>
      {loading && <ActivityIndicator size="large" />}
      {error !== "" && <Text>{error}</Text>}
      {playlist && playlist.tracks.length === 0 && <Text>القائمة فاضية</Text>}
      {playlist && (
        <>
          <Text style={{ fontSize: 24, fontWeight: "700", padding: 16 }}>
            {playlist.name}
          </Text>
          <FlatList
            data={playlist.tracks}
            renderItem={({ item }) => (
              <SongListItem
                song={item}
                isLiked={false}
                onLikePress={() => {}}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </>
      )}
    </SafeAreaView>
  );
}
