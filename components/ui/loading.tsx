import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/colors";

/**
 * Loading — centered spinner wrapper (components/ui).
 * A small consistency helper for full-screen / section loading states.
 */

interface LoadingProps {
  fullScreen?: boolean;
  size?: "small" | "large";
}

export function Loading({ fullScreen = false, size = "large" }: LoadingProps) {
  return (
    <View style={[styles.wrap, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={Colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", paddingVertical: 32 },
  fullScreen: { flex: 1, backgroundColor: Colors.background },
});
