import { formatTime } from "@/utils/format_time";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
type SongListItemProps = {
  song: {
    id: number;
    title: string;
    artist: string;
    cover_url: string;
    duration: number;
  };
};
export default function SongListItem({ song }: SongListItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={{
          uri: song.cover_url,
        }}
        style={{ width: 50, height: 50 }}
      />
      <View>
        <Text>{song.title}</Text>
        <Text style={{ color: "gray", fontSize: 13 }}>{song.artist}</Text>
      </View>
      <Text>{formatTime(song.duration)}</Text>
      <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
        <Ionicons name="heart" size={24} color={isLiked ? "#FF5A3C" : "gray"} />
      </TouchableOpacity>
    </View>
  );
}
