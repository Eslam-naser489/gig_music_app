import PlaylistCard from "@/components/play_lists/play_list_card";
import {
    createPlaylist,
    deletePlaylist,
    getPlaylists,
    renamePlaylist,
} from "@/services/play_list_service";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
export default function PlayList() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [renameId, setRenameId] = useState<number | null>(null);
  const [renameName, setRenameName] = useState("");
  const router = useRouter();
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
  useEffect(() => {
    getPlaylists()
      .then((data) => setPlaylists(data))
      .catch(() => setError("فشل تحميل قوائم التشغيل"))
      .finally(() => setLoading(false));
  }, []);
  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ padding: 16, alignItems: "flex-end" }}
      >
        <Text style={{ color: "#FF5A3C", fontSize: 16, fontWeight: "600" }}>
          + قائمة جديدة
        </Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" />}
      {error !== "" && <Text>{error}</Text>}
      {!loading && playlists.length === 0 && <Text>مفيش قوائم تشغيل</Text>}
      <FlatList
        data={playlists}
        renderItem={({ item }) => (
          <PlaylistCard
            playlist={item}
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
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 12 }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
              قائمة تشغيل جديدة
            </Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="الاسم"
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
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
                <Text>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreate} style={{ padding: 10 }}>
                <Text style={{ color: "#FF5A3C", fontWeight: "600" }}>
                  إنشاء
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
      </Modal>
      <Modal visible={renameId !== null} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "rgba(0,0,0,0.4)" }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>إعادة تسمية</Text>
            <TextInput value={renameName} onChangeText={setRenameName} style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 16 }} />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity onPress={() => setRenameId(null)} style={{ padding: 10 }}><Text>إلغاء</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleRename} style={{ padding: 10 }}><Text style={{ color: "#FF5A3C", fontWeight: "600" }}>حفظ</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
