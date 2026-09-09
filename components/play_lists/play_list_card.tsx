import { Text, TouchableOpacity, View } from "react-native";
type PlaylistCardProps = {
  playlist: {
    id: number;
    name: string;
    track_count: number;
  };
  onPress: () => void;
};
export default function PlaylistCard({ playlist, onPress }: PlaylistCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      }}
    >
      <View>
        <Text style={{ fontWeight: "600", fontSize: 16 }}>{playlist.name}</Text>
        <Text style={{ color: "gray", fontSize: 13 }}>
          {playlist.track_count} tracks
        </Text>
      </View>
    </TouchableOpacity>
  );
}
