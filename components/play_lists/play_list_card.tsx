import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
type PlaylistCardProps = {
  playlist: {
    id: number;
    name: string;
    track_count: number;
  };
  onPress: () => void;
  onDelete: () => void;
};
export default function PlaylistCard({
  playlist,
  onPress,
  onDelete,
}: PlaylistCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "600", fontSize: 16 }}>{playlist.name}</Text>
        <Text style={{ color: "gray", fontSize: 13 }}>
          {playlist.track_count} tracks
        </Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={{ padding: 8 }}>
        <Ionicons name="trash-outline" size={20} color="gray" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
