import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "@/components/layout/header";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/Typography";
import { Theme } from "@/constants/theme";

/**
 * Now Playing screen — placeholder shell so this route has a valid
 * default export (an empty file here crashes the whole app's
 * navigator on boot, including every "tap a song" flow from Home).
 * Full playback controls are a separate member's scope; swap the body
 * out once that's built — the Header/back-button wiring can stay.
 */
export default function PlayerScreen() {
  const { songId } = useLocalSearchParams<{ songId: string }>();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <Header title="Playing Now" showBack />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Theme.spacing.xxl }]}>
        <View style={styles.artwork}>
          <Ionicons name="musical-notes" size={64} color={Colors.accent} />
        </View>

        <Text style={[Typography.title, styles.title]}>Player controls coming soon</Text>
        <Text style={[Typography.body, styles.subtitle]}>
          Track #{songId} will play here once the Player module ships.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { alignItems: "center", paddingHorizontal: Theme.spacing.xxl, paddingTop: Theme.spacing.xxxl },
  artwork: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: Theme.borderRadius.xl,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.spacing.xxl,
  },
  title: { color: Colors.textPrimary, textAlign: "center" },
  subtitle: { color: Colors.textSecondary, textAlign: "center", marginTop: Theme.spacing.sm },
});
