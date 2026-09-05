import SongListItem from "@/components/play_lists/song_list_item";
import { SafeAreaView } from "react-native";
export default function LikedSongs() {
  return (
    <SafeAreaView>
      <SongListItem
        song={{
          id: 1,
          title: "Africa",
          artist: "Toto",
          cover_url:
            "https://cdn-images.dzcdn.net/images/cover/153332e88a14255a8c3d5959a5a21882/500x500-000000-80-0-0.jpg",
          duration: 295,
        }}
      />
    </SafeAreaView>
  );
}
