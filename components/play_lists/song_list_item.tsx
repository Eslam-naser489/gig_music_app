import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
export default function SongListItem() {
  return (
    <View>
      <Image
        source={{ uri: "حط_هنا_رابط_cover_url" }}
        style={{ width: 50, height: 50 }}
      />
      <Text>Africa</Text>
      <Ionicons name="heart" size={24} color="#FF5A3C" />
    </View>
  );
}
