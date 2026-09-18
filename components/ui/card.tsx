import { Pressable, StyleSheet, View } from "react-native";
import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Colors } from "@/constants/colors";
import { Theme } from "@/constants/theme";

/**
 * Card — shared surface container (components/ui).
 * Owned by the Infrastructure & Layout member. Wraps content in a
 * consistent rounded surface with optional press behavior.
 */

export type CardVariant = "surface" | "outline" | "soft";

interface CardProps extends PropsWithChildren {
  variant?: CardVariant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  accessibilityLabel?: string;
}

function variantStyle(variant: CardVariant): StyleProp<ViewStyle> {
  switch (variant) {
    case "outline":
      return { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border };
    case "soft":
      return { backgroundColor: Colors.surfaceElevated };
    default:
      return { backgroundColor: Colors.surface, ...Theme.shadow.sm };
  }
}

export function Card({ children, variant = "surface", onPress, style, padded = true, accessibilityLabel }: CardProps) {
  const content = (
    <View style={[styles.base, variantStyle(variant), padded && styles.padded, style]}>{children}</View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={Theme.hitSlop}
      style={({ pressed }) => pressed && styles.pressed}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: Theme.borderRadius.lg, overflow: "hidden" },
  padded: { padding: Theme.spacing.lg },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});
