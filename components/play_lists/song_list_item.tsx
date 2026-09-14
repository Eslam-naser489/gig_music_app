import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/Typography";
import { formatTime } from "@/utils/format_time";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
type SongListItemProps = {
  isLiked: boolean;
  onLikePress: () => void;
  iconName?: "heart" | "heart-outline" | "remove-circle-outline";
  song: {
    id: number;
    title: string;
    artist: string;
    cover_url: string;
    duration: number;
  };
};
export default function SongListItem({
  song,
  isLiked,
  onLikePress,
  iconName,
}: SongListItemProps) {
  return (
    <View style={styles.row}>
      <Image
        source={{
          uri: song.cover_url,
        }}
        style={{ width: 56, height: 56, borderRadius: 8 }}
      />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ ...Typography.bodyBold, color: Colors.textPrimary }}>
          {song.title}
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          {song.artist}
        </Text>
      </View>
      <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
        {formatTime(song.duration)}
      </Text>
      <TouchableOpacity onPress={onLikePress}>
        <Ionicons
          name={iconName || (isLiked ? "heart" : "heart-outline")}
          size={24}
          color={isLiked ? Colors.accent : Colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
});
