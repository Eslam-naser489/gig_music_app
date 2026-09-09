import PlaylistCard from "@/components/play_lists/play_list_card";
import { getPlaylists } from "@/services/play_list_service";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, Text } from "react-native";

export default function PlayList() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    getPlaylists()
      .then((data) => setPlaylists(data))
      .catch(() => setError("فشل تحميل قوائم التشغيل"))
      .finally(() => setLoading(false));
  }, []);
  return (
    <SafeAreaView>
      {loading && <ActivityIndicator size="large" />}
      {error !== "" && <Text>{error}</Text>}
      {!loading && playlists.length === 0 && <Text>مفيش قوائم تشغيل</Text>}
      <FlatList
        data={playlists}
        renderItem={({ item }) => (
          <PlaylistCard playlist={item} onPress={() => {}} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}
