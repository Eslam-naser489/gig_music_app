// app/(auth)/onboarding.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>{"let's start"}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.imageWrapper}>
          <Ionicons name="musical-notes" size={110} color={Colors.accent} />
        </View>

        <Text style={styles.title}>GIG Music</Text>
        <Text style={styles.subtitle}>
          A sleek, modern music app that brings your favorite songs, artists,
          and playlists together
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => router.push("/(auth)/login")}
          accessibilityRole="button"
        >
          <Text style={styles.startText}>{"Let's Start"}</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.textInverse} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E222A" },
  topBar: { paddingHorizontal: 24, paddingTop: 16 },
  topBarText: { color: "#A0AAB8", fontSize: 16, fontWeight: "500" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  imageWrapper: {
    width: 240,
    height: 240,
    borderRadius: 120,
    marginBottom: 40,
    borderWidth: 3,
    borderColor: "#C84B31",
    backgroundColor: "#262B35",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#F5F7FA",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    color: "#A0AAB8",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  footer: { padding: 24, paddingBottom: 40 },
  startButton: {
    backgroundColor: "#C84B31",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  startText: { color: Colors.textInverse, fontSize: 16, fontWeight: "700" },
});
