import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/Typography";
import { Theme } from "@/constants/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

interface Feature {
  icon: IconName;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  { icon: "sparkles-outline", title: "Personalized picks", description: "“Recommended for you” adapts to what you play." },
  { icon: "albums-outline", title: "Your playlists", description: "Organize tracks into playlists and keep building your library." },
  { icon: "heart-outline", title: "Liked songs", description: "Save any track to your Liked Songs in one tap." },
  { icon: "play-skip-forward-outline", title: "Playback controls", description: "Play, pause, skip and manage tracks from any screen." },
];

/**
 * Learn More / About screen — owned by the Infrastructure & Layout member.
 */
export default function LearnMoreScreen() {
  return (
    <View style={styles.screen}>
      <Header title="Learn More" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Ionicons name="musical-notes" size={28} color="#FFFFFF" />
          <Text style={styles.heroTitle}>GIG Music Player</Text>
          <Text style={styles.heroSubtitle}>Your music, organized and always one tap away.</Text>
        </View>

        <Text style={[Typography.bodyBold, styles.sectionTitle]}>What you can do</Text>
        <View style={styles.featureList}>
          {FEATURES.map((feature) => (
            <Card key={feature.title} variant="outline" style={styles.featureCard}>
              <View style={styles.featureRow}>
                <View style={styles.featureIconTile}>
                  <Ionicons name={feature.icon} size={18} color={Colors.accent} />
                </View>
                <View style={styles.featureTextWrap}>
                  <Text style={[Typography.bodyBold, { color: Colors.textPrimary }]}>{feature.title}</Text>
                  <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: 2 }]}>{feature.description}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <Text style={[Typography.bodyBold, styles.sectionTitle]}>Built by</Text>
        <Card variant="outline" style={styles.buildCard}>
          <Text style={[Typography.body, { color: Colors.textSecondary }]}>
            A graduation project built by a 5-person team — authentication, discovery &amp; home, the
            music player, playlists &amp; liked songs, and the shared layout &amp; infrastructure
            you're looking at right now.
          </Text>
        </Card>

        <Card variant="outline" style={styles.linkCard} onPress={() => Linking.openURL("https://docs.expo.dev")}>
          <View style={styles.linkRow}>
            <Ionicons name="book-outline" size={18} color={Colors.accent} />
            <Text style={[Typography.bodyBold, { color: Colors.textPrimary, flex: 1 }]}>Built with Expo &amp; React Native</Text>
            <Ionicons name="open-outline" size={16} color={Colors.textTertiary} />
          </View>
        </Card>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Theme.spacing.lg, paddingBottom: 48 },
  hero: {
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xxl,
    alignItems: "center",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.xxl,
    backgroundColor: Colors.accent,
  },
  heroTitle: { fontSize: 22, fontWeight: "800", color: "#FFFFFF" },
  heroSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.85)", textAlign: "center" },
  sectionTitle: { marginTop: Theme.spacing.xl, marginBottom: Theme.spacing.sm, color: Colors.textPrimary },
  featureList: { gap: Theme.spacing.sm },
  featureCard: { padding: 0 },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  featureIconTile: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTextWrap: { flex: 1 },
  buildCard: { padding: Theme.spacing.lg },
  linkCard: { marginTop: Theme.spacing.sm, padding: 0 },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  version: { marginTop: Theme.spacing.xxl, textAlign: "center", fontSize: 12, color: Colors.textTertiary },
});
