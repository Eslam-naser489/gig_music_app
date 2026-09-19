import SongListItem from "@/components/play_lists/song_list_item";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/Typography";
import {
  addTrackToPlaylist,
  getAllTracks,
  getPlaylistById,
  removeTrackFromPlaylist,
} from "@/services/play_list_service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlaylistDetail() {
  const { playlListId } = useLocalSearchParams();
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addVisible, setAddVisible] = useState(false);
  const [allTracks, setAllTracks] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    getPlaylistById(playlListId as string)
      .then((data) => setPlaylist(data))
      .catch(() => setError("فشل تحميل قائمة التشغيل"))
      .finally(() => setLoading(false));
  }, [playlListId]);
  const handleRemoveTrack = (trackId: number) => {
    setPlaylist({
      ...playlist,
      tracks: playlist.tracks.filter((t: any) => t.id !== trackId),
    });

    removeTrackFromPlaylist(playlListId as string, trackId).catch(() =>
      setError("فشل حذف الأغنية"),
    );
  };
  const openAdd = () => {
    setAddVisible(true);
    getAllTracks()
      .then((data) => setAllTracks(data))
      .catch(() => setError("فشل تحميل الأغاني"));
  };

  const handleAddTrack = (trackId: number) => {
    addTrackToPlaylist(playlListId as string, trackId)
      .then((updated) => {
        setPlaylist(updated);
        setAddVisible(false);
      })
      .catch(() => setError("فشل إضافة الأغنية"));
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      {loading && <ActivityIndicator size="large" color={Colors.accent} />}
      {error !== "" && (
        <View style={{ padding: 32, alignItems: "center" }}>
          <Text style={{ ...Typography.body, color: Colors.error }}>
            {error}
          </Text>
        </View>
      )}
      {playlist && playlist.tracks.length === 0 && (
        <View style={{ padding: 32, alignItems: "center" }}>
          <Text style={{ ...Typography.body, color: Colors.textSecondary }}>
            القائمة فاضية
          </Text>
        </View>
      )}
      {playlist && (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingTop: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/play_list"))}
              style={{ padding: 4 }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
            <Text
              style={{
                ...Typography.header,
                color: Colors.textPrimary,
                marginLeft: 12,
                flex: 1,
              }}
            >
              {playlist.name}
            </Text>
          </View>

          <TouchableOpacity
            onPress={openAdd}
            style={{ paddingHorizontal: 16, paddingVertical: 12 }}
          >
            <Text style={{ ...Typography.button, color: Colors.accent }}>
              + إضافة أغنية
            </Text>
          </TouchableOpacity>

          <FlatList
            data={playlist.tracks}
            renderItem={({ item }) => (
              <SongListItem
                song={item}
                isLiked={false}
                onLikePress={() => handleRemoveTrack(item.id)}
                iconName="remove-circle-outline"
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <Modal visible={addVisible} transparent animationType="fade">
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                padding: 24,
                backgroundColor: Colors.overlay,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.surface,
                  borderRadius: 12,
                  maxHeight: "70%",
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    ...Typography.title,
                    color: Colors.textPrimary,
                    padding: 16,
                  }}
                >
                  اختر أغنية
                </Text>
                <FlatList
                  data={allTracks}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleAddTrack(item.id)}
                      style={{
                        padding: 14,
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.border,
                      }}
                    >
                      <Text
                        style={{
                          ...Typography.bodyBold,
                          color: Colors.textPrimary,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          ...Typography.caption,
                          color: Colors.textSecondary,
                        }}
                      >
                        {item.artist}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
                <TouchableOpacity
                  onPress={() => setAddVisible(false)}
                  style={{ padding: 14, alignItems: "center" }}
                >
                  <Text
                    style={{ ...Typography.body, color: Colors.textSecondary }}
                  >
                    إلغاء
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
}
