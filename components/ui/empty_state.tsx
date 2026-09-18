import { StyleSheet, Text, View } from "react-native";
import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/Typography";
import { Theme } from "@/constants/theme";

/**
 * EmptyState — consistent "nothing here yet" block (components/ui).
 * Several screens currently inline their own version of this
 * (e.g. "مفيش قوائم تشغيل" as a bare `<Text>`); new screens should use
 * this instead so empty states look the same everywhere.
 */

type IconName = ComponentProps<typeof Ionicons>["name"];

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  hint?: string;
}

export function EmptyState({ icon = "musical-notes-outline", title, hint }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconTile}>
        <Ionicons name={icon} size={26} color={Colors.accent} />
      </View>
      <Text style={[Typography.bodyBold, styles.title]}>{title}</Text>
      {hint ? <Text style={[Typography.caption, styles.hint]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", paddingVertical: 40, paddingHorizontal: Theme.spacing.xxl },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: Theme.borderRadius.lg,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.spacing.md,
  },
  title: { color: Colors.textPrimary, textAlign: "center" },
  hint: { color: Colors.textSecondary, textAlign: "center", marginTop: 4 },
});
