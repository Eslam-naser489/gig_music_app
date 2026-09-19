import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/colors";
import type { AppColors } from "@/constants/colors";
import { Theme } from "@/constants/theme";

/**
 * Button — shared, reusable action button (components/ui).
 * Owned by the Infrastructure & Layout member; screens should use this
 * instead of hand-rolling their own TouchableOpacity + colors.
 */

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ComponentProps<typeof Ionicons>["name"];
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  // Optional palette override — pass useTheme().colors from a screen that
  // supports dark mode. Defaults to the static (always-light) Colors.
  colors?: AppColors;
}

const SIZE_STYLES: Record<
  ButtonSize,
  { height: number; paddingHorizontal: number; fontSize: number; iconSize: number }
> = {
  sm: { height: 40, paddingHorizontal: Theme.spacing.lg, fontSize: 13, iconSize: 16 },
  md: { height: 50, paddingHorizontal: Theme.spacing.xl, fontSize: 15, iconSize: 18 },
  lg: { height: 56, paddingHorizontal: Theme.spacing.xxl, fontSize: 16, iconSize: 20 },
};

function textColor(variant: ButtonVariant, colors: AppColors): string {
  switch (variant) {
    case "primary":
    case "danger":
      return colors.textInverse;
    case "secondary":
      return colors.accentDark;
    case "outline":
    case "ghost":
    default:
      return colors.textPrimary;
  }
}

function variantStyle(variant: ButtonVariant, colors: AppColors) {
  switch (variant) {
    case "primary":
      return { backgroundColor: colors.accent };
    case "secondary":
      return { backgroundColor: colors.accentLight };
    case "outline":
      return { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.border };
    case "ghost":
      return { backgroundColor: "transparent" };
    case "danger":
      return { backgroundColor: colors.error };
    default:
      return {};
  }
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  accessibilityLabel,
  colors = Colors,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const sizeStyle = SIZE_STYLES[size];
  const color = textColor(variant, colors);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        { height: sizeStyle.height, paddingHorizontal: sizeStyle.paddingHorizontal },
        fullWidth && styles.fullWidth,
        variantStyle(variant, colors),
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      <View style={styles.contentRow}>
        {loading ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <>
            {icon && iconPosition === "left" ? <Ionicons name={icon} size={sizeStyle.iconSize} color={color} /> : null}
            <Text style={[styles.label, { fontSize: sizeStyle.fontSize, color }]} numberOfLines={1}>
              {label}
            </Text>
            {icon && iconPosition === "right" ? <Ionicons name={icon} size={sizeStyle.iconSize} color={color} /> : null}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Theme.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: { width: "100%" },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  disabled: { opacity: 0.5 },
  contentRow: { flexDirection: "row", alignItems: "center", gap: Theme.spacing.sm },
  label: { fontWeight: "700" },
});
