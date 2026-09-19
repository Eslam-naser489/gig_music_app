// components/home/MyPlaylistSection.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Playlist, Song } from "../../types";
import { getMyPlaylist } from "@/services/music_service";


interface Props {
  onSongPress?: (song: Song, queue: Song[]) => void;
}

export default function MyPlaylistSection({ onSongPress }: Props) {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getMyPlaylist().then((data) => {
      if (isMounted) {
        setPlaylist(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!playlist) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{playlist.title}</Text>
      <FlatList
        data={playlist.songs}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onSongPress?.(item, playlist.songs)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.coverUrl }} style={styles.cover} />
            <Text style={styles.songTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {item.artist}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 24 },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  list: { paddingHorizontal: 16, gap: 12 },
  card: { width: 120, marginRight: 12 },
  cover: { width: 120, height: 120, borderRadius: 12, marginBottom: 6 },
  songTitle: { fontSize: 13, fontWeight: "500" },
  artist: { fontSize: 11, color: "#888" },
  loadingBox: { paddingVertical: 24, alignItems: "center" },
});
