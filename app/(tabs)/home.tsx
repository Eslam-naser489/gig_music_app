// app/(tabs)/home.tsx
import React from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

import { Song } from "../../types";
import RecommendedSection from "@/components/home/recommended_section";
import MyPlaylistSection from "@/components/home/my_play_list_section";

export default function HomeScreen() {
  const router = useRouter();

  const handleSongPress = (song: Song) => {
    router.push(`/player/${song.id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
        <Text style={styles.greeting}>Home</Text>
        </View>

        <RecommendedSection onSongPress={handleSongPress} />
        <MyPlaylistSection onSongPress={handleSongPress} />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  greeting: { fontSize: 24, fontWeight: "700" },
});
