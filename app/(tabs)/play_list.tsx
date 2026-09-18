import PlaylistCard from "@/components/play_lists/play_list_card";
import { IconButton } from "@/components/ui/icon_button";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/Typography";
import { useSideMenu } from "@/context/side_menu_context";
import {
  createPlaylist,
  deletePlaylist,
  getPlaylists,
  renamePlaylist,
} from "@/services/play_list_service";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function PlayList() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [renameId, setRenameId] = useState<number | null>(null);
  const [renameName, setRenameName] = useState("");
  const router = useRouter();
  const { width } = useWindowDimensions();
  const sideMenu = useSideMenu();

  const H_PADDING = 16;
  const GAP = 16;
  const MIN_CARD_WIDTH = 140;
  const MAX_CARD_WIDTH = 200;

  const availableWidth = width - H_PADDING * 2;
  const numColumns = Math.max(
    2,
    Math.floor((availableWidth + GAP) / (MIN_CARD_WIDTH + GAP)),
  );
  const rawCardWidth = (availableWidth - GAP * (numColumns - 1)) / numColumns;
  const cardWidth = Math.min(rawCardWidth, MAX_CARD_WIDTH);

  const handleDelete = (id: number) => {
    setPlaylists(playlists.filter((p) => p.id !== id));

    deletePlaylist(id).catch(() => setError("فشل حذف قائمة التشغيل"));
  };
  const handleRename = () => {
    renamePlaylist(renameId as number, renameName)
      .then((updated) => {
        setPlaylists(playlists.map((p) => (p.id === updated.id ? updated : p)));
        setRenameId(null);
        setRenameName("");
      })
      .catch(() => setError("فشل إعادة التسمية"));
  };
  const handleCreate = () => {
    createPlaylist(newName)
      .then((created) => {
        setPlaylists([created, ...playlists]);
        setNewName("");
        setModalVisible(false);
      })
      .catch(() => setError("فشل إنشاء قائمة التشغيل"));
  };
  useFocusEffect(
    useCallback(() => {
      getPlaylists()
        .then((data) => setPlaylists(data))
        .catch(() => setError("فشل تحميل قوائم التشغيل"))
        .finally(() => setLoading(false));
    }, []),
  );
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
        <Text style={{ ...Typography.header, color: Colors.textPrimary }}>Playlists</Text>
      </View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ padding: 16, alignSelf: "flex-end" }}
      >
        <Text style={{ ...Typography.button, color: Colors.accent }}>
          + قائمة جديدة
        </Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color={Colors.accent} />}
      {error !== "" && (
        <View style={{ padding: 32, alignItems: "center" }}>
          <Text style={{ ...Typography.body, color: Colors.error }}>
            {error}
          </Text>
        </View>
      )}
      {!loading && playlists.length === 0 && (
        <View style={{ padding: 32, alignItems: "center" }}>
          <Text style={{ ...Typography.body, color: Colors.textSecondary }}>
            مفيش قوائم تشغيل
          </Text>
        </View>
      )}
      <FlatList
        numColumns={numColumns}
        key={numColumns}
        data={playlists}
        columnWrapperStyle={{ gap: GAP, paddingHorizontal: H_PADDING }}
        contentContainerStyle={{ gap: GAP, paddingBottom: GAP }}
        renderItem={({ item }) => (
          <PlaylistCard
            playlist={item}
            cardWidth={cardWidth}
            onPress={() => router.push(`/playlists/${item.id}`)}
            onDelete={() => handleDelete(item.id)}
            onRename={() => {
              setRenameId(item.id);
              setRenameName(item.name);
            }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal visible={modalVisible} transparent animationType="fade">
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
              padding: 20,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                ...Typography.title,
                color: Colors.textPrimary,
                marginBottom: 12,
              }}
            >
              قائمة تشغيل جديدة
            </Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="الاسم"
              style={{
                borderWidth: 1,
                borderColor: Colors.border,
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
              }}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ padding: 10 }}
              >
                <Text
                  style={{ ...Typography.body, color: Colors.textSecondary }}
                >
                  إلغاء
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreate} style={{ padding: 10 }}>
                <Text style={{ ...Typography.button, color: Colors.accent }}>
                  إنشاء
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={renameId !== null} transparent animationType="fade">
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
              padding: 20,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                ...Typography.title,
                color: Colors.textPrimary,
                marginBottom: 12,
              }}
            >
              إعادة تسمية
            </Text>
            <TextInput
              value={renameName}
              onChangeText={setRenameName}
              style={{
                borderWidth: 1,
                borderColor: Colors.border,
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
              }}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setRenameId(null)}
                style={{ padding: 10 }}
              >
                <Text
                  style={{ ...Typography.body, color: Colors.textSecondary }}
                >
                  إلغاء
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRename} style={{ padding: 10 }}>
                <Text style={{ ...Typography.button, color: Colors.accent }}>
                  حفظ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
