import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/Typography";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
type PlaylistCardProps = {
  playlist: {
    id: number;
    name: string;
    track_count: number;
  };
  cardWidth?: number | string;
  onPress: () => void;
  onDelete: () => void;
  onRename: () => void;
};
export default function PlaylistCard({
  playlist,
  cardWidth,
  onPress,
  onDelete,
  onRename,
}: PlaylistCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ width: cardWidth as any, marginBottom: 20 }}
    >
      <View
        style={{
          width: "100%",
          aspectRatio: 1,
          borderRadius: 12,
          backgroundColor: Colors.accentLight,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="musical-notes" size={64} color={Colors.accent} />
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{ ...Typography.bodyBold, color: Colors.textPrimary }}
            numberOfLines={1}
          >
            {playlist.name}
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            {playlist.track_count} tracks
          </Text>
        </View>
        <TouchableOpacity onPress={onRename} style={{ padding: 4 }}>
          <Ionicons
            name="pencil-outline"
            size={18}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={{ padding: 4 }}>
          <Ionicons
            name="trash-outline"
            size={18}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
