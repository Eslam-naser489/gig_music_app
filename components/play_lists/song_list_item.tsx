import { formatTime } from "@/utils/format_time";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
type SongListItemProps = {
  isLiked: boolean;
  onLikePress: () => void;
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
        <Text style={{ fontWeight: "600", fontSize: 15 }}>{song.title}</Text>
        <Text style={{ color: "gray", fontSize: 13 }}>{song.artist}</Text>
      </View>
      <Text style={{ color: "gray", fontSize: 13 }}>
        {formatTime(song.duration)}
      </Text>
      <TouchableOpacity onPress={onLikePress}>
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"}
          size={24}
          color={isLiked ? "#FF5A3C" : "gray"}
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
    borderBottomColor: "#eee",
  },
});
