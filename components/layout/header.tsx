import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconButton } from "@/components/ui/icon_button";
import { useSideMenu } from "@/context/side_menu_context";
import { Colors } from "@/constants/colors";
import type { AppColors } from "@/constants/colors";
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
  // Optional palette override — pass useTheme().colors from a screen that
  // supports dark mode. Defaults to the static (always-light) Colors.
  colors?: AppColors;
}

export function Header({
  title,
  showBack = false,
  hideLeading = false,
  rightIcon,
  onRightPress,
  colors = Colors,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const sideMenu = useSideMenu();

  const handleLeadingPress = () => {
    if (showBack) {
      // If this screen was opened with no back history (e.g. a dev
      // Fast Refresh reset navigation state, or the app landed here
      // directly), router.back() silently does nothing and logs a
      // "GO_BACK not handled" warning, leaving the user stuck. Fall
      // back to Home so the button always does something.
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)/home");
      }
    } else {
      sideMenu.show();
    }
  };

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + Theme.spacing.md, backgroundColor: colors.background }]}>
      {hideLeading ? (
        <View style={styles.placeholder} />
      ) : (
        <IconButton
          icon={showBack ? "chevron-back" : "menu"}
          onPress={handleLeadingPress}
          accessibilityLabel={showBack ? "Go back" : "Open menu"}
          colors={colors}
        />
      )}

      <Text style={[Typography.title, styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
        {title}
      </Text>

      {rightIcon ? (
        <IconButton
          icon={rightIcon}
          onPress={onRightPress ?? (() => {})}
          accessibilityLabel="Header action"
          colors={colors}
        />
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
  },
  title: { flex: 1, textAlign: "center" },
  placeholder: { width: Theme.minTouchTarget, height: Theme.minTouchTarget },
});
