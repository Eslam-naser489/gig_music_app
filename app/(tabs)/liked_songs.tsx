import SongListItem from "@/components/play_lists/song_list_item";
import { MOCK_LIKED_SONGS } from '@/services/mock/liked_songs';
import { SafeAreaView, FlatList } from 'react-native';
export default function LikedSongs() {
  return (
    <FlatList
        data={MOCK_LIKED_SONGS}
        renderItem={({ item }) => <SongListItem song={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
  );
}