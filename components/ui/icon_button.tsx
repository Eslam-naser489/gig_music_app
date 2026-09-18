import { Pressable, StyleSheet } from "react-native";
import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/colors";
import { Theme } from "@/constants/theme";

/**
 * IconButton — shared circular icon-only touch target (components/ui).
 * Replaces the ad-hoc `<TouchableOpacity><Ionicons .../></TouchableOpacity>`
 * pattern repeated across screens (back buttons, menu button, etc.).
 */

type IconName = ComponentProps<typeof Ionicons>["name"];

interface IconButtonProps {
  icon: IconName;
  onPress: () => void;
  size?: number;
  color?: string;
  variant?: "filled" | "plain";
  accessibilityLabel: string;
}

export function IconButton({
  icon,
  onPress,
  size = 20,
  color = Colors.textPrimary,
  variant = "filled",
  accessibilityLabel,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={Theme.hitSlop}
      style={({ pressed }) => [
        styles.base,
        variant === "filled" && styles.filled,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: Theme.minTouchTarget,
    height: Theme.minTouchTarget,
    borderRadius: Theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  filled: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: { transform: [{ scale: 0.94 }] },
});
