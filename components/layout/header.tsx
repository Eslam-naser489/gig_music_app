import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconButton } from "@/components/ui/icon_button";
import { useSideMenu } from "@/context/side_menu_context";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/Typography";
import { Theme } from "@/constants/theme";

/**
 * Header — shared top bar (components/layout).
 * Leading icon opens the global Side Menu by default; pass `showBack`
 * for detail-style screens where it should go back instead.
 */

type IconName = ComponentProps<typeof Ionicons>["name"];

interface HeaderProps {
  title: string;
  showBack?: boolean;
  hideLeading?: boolean;
  rightIcon?: IconName;
  onRightPress?: () => void;
}

export function Header({ title, showBack = false, hideLeading = false, rightIcon, onRightPress }: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const sideMenu = useSideMenu();

  const handleLeadingPress = () => {
    if (showBack) {
      router.back();
    } else {
      sideMenu.show();
    }
  };

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + Theme.spacing.md }]}>
      {hideLeading ? (
        <View style={styles.placeholder} />
      ) : (
        <IconButton
          icon={showBack ? "chevron-back" : "menu"}
          onPress={handleLeadingPress}
          accessibilityLabel={showBack ? "Go back" : "Open menu"}
        />
      )}

      <Text style={[Typography.title, styles.title]} numberOfLines={1}>
        {title}
      </Text>

      {rightIcon ? (
        <IconButton icon={rightIcon} onPress={onRightPress ?? (() => {})} accessibilityLabel="Header action" />
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.sm,
    backgroundColor: Colors.background,
  },
  title: { flex: 1, textAlign: "center", color: Colors.textPrimary },
  placeholder: { width: Theme.minTouchTarget, height: Theme.minTouchTarget },
});
