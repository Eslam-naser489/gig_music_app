import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Header } from "@/components/layout/header";
import { EmptyState } from "@/components/ui/empty_state";
import { Loading } from "@/components/ui/loading";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/Typography";
import { Theme } from "@/constants/theme";
import { formatTime } from "@/utils/format_time";
import { useSearch } from "@/hooks/useSearch";
import { usePlayer } from "@/hooks/use_player";
import { Song, SearchResult } from "@/types";

/**
 * Search screen — real search over the backend's tracks, filtered
 * client-side by title/artist (see services/search_service.ts and
 * music_service.searchTracks — there's no dedicated /search/ endpoint
 * on the backend yet). Debounced + cancellable via useSearch.
 */
export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { results, loading, error } = useSearch(query);
  const { playSong } = usePlayer();

  const songs = results
    .filter((result): result is SearchResult & { item: Song } => result.type === "song")
    .map((result) => result.item);

  const hasQuery = query.trim().length > 0;

  const renderBody = () => {
    if (!hasQuery) {
      return (
        <EmptyState
          icon="search-outline"
          title="Search for your favorite music"
          hint="Find songs by title or artist"
        />
      );
    }

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <EmptyState icon="alert-circle-outline" title="Something went wrong" hint={error} />;
    }

    if (songs.length === 0) {
      return (
        <EmptyState
          icon="sad-outline"
          title="No results found"
          hint={`No matches for "${query.trim()}"`}
        />
      );
    }

    return (
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => {
              // Start playback with the current search results as the queue
              // before navigating — the player screen's own fallback lookup
              // only checks /recommendations/, which search results usually
              // aren't part of, so skipping this showed "Song not found".
              playSong(item, songs);
              router.push(`/player/${item.id}`);
            }}
          >
            {item.coverUrl ? (
              <Image source={{ uri: item.coverUrl }} style={styles.cover} />
            ) : (
              <View style={[styles.cover, styles.coverPlaceholder]}>
                <Ionicons name="musical-note" size={18} color={Colors.textTertiary} />
              </View>
            )}
            <View style={styles.rowText}>
              <Text style={[Typography.bodyBold, styles.rowTitle]} numberOfLines={1}>
                {item.title || "Untitled"}
              </Text>
              <Text style={[Typography.caption, styles.rowArtist]} numberOfLines={1}>
                {item.artist || "Unknown artist"}
              </Text>
            </View>
            {item.duration ? (
              <Text style={[Typography.caption, styles.duration]}>{formatTime(item.duration)}</Text>
            ) : null}
          </Pressable>
        )}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <Header title="Search" />

      <View style={styles.searchBarWrap}>
        <Ionicons name="search" size={18} color={Colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search songs, artists..."
          placeholderTextColor={Colors.textTertiary}
          style={styles.searchInput}
          autoCorrect={false}
          returnKeyType="search"
        />
        {hasQuery ? (
          <Pressable
            onPress={() => setQuery("")}
            hitSlop={Theme.hitSlop}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
          </Pressable>
        ) : null}
      </View>

      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  searchBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    height: 44,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { marginRight: Theme.spacing.sm },
  searchInput: {
    flex: 1,
    height: "100%",
    color: Colors.textPrimary,
    fontSize: 15,
  },
  list: { paddingHorizontal: Theme.spacing.lg, paddingBottom: Theme.spacing.xxxl },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
  },
  rowPressed: { opacity: 0.6 },
  cover: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Colors.surfaceElevated,
  },
  coverPlaceholder: { alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1, marginLeft: Theme.spacing.md, marginRight: Theme.spacing.sm },
  rowTitle: { color: Colors.textPrimary },
  rowArtist: { color: Colors.textSecondary, marginTop: 2 },
  duration: { color: Colors.textTertiary },
});
