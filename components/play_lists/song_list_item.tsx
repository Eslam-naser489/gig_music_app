import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
type SongListItemProps = {
  song: {
    id: number;
    title: string;
    artist: string;
    cover_url: string;
    duration: number;
  };
};
export default function SongListItem({song}: SongListItemProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={{
          uri: song.cover_url
        }}
        style={{ width: 50, height: 50 }}
      />
      <View>
        <Text>{song.title}</Text>
        <Text style={{ color: "gray", fontSize: 13 }}>{song.artist}</Text>
      </View>
      <Ionicons name="heart" size={24} color="#FF5A3C" />
    </View>
  );
}
