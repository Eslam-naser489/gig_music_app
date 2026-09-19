import { Pressable, StyleSheet, View } from "react-native";
import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Colors } from "@/constants/colors";
import type { AppColors } from "@/constants/colors";
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
  // Optional palette override — pass useTheme().colors from a screen that
  // supports dark mode. Defaults to the static (always-light) Colors, so
  // every screen that doesn't pass this looks exactly as before.
  colors?: AppColors;
}

function variantStyle(variant: CardVariant, colors: AppColors): StyleProp<ViewStyle> {
  switch (variant) {
    case "outline":
      return { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border };
    case "soft":
      return { backgroundColor: colors.surfaceElevated };
    default:
      return { backgroundColor: colors.surface, ...Theme.shadow.sm };
  }
}

export function Card({
  children,
  variant = "surface",
  onPress,
  style,
  padded = true,
  accessibilityLabel,
  colors = Colors,
}: CardProps) {
  const content = (
    <View style={[styles.base, variantStyle(variant, colors), padded && styles.padded, style]}>{children}</View>
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
