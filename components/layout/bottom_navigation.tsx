import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { Colors } from "@/constants/colors";
import { Theme } from "@/constants/theme";

/**
 * BottomNavigation — custom tab bar (components/layout), swapped in via
 * the `tabBar` prop on the `(tabs)` Tabs navigator. Reuses whatever
 * `tabBarIcon` each Tabs.Screen already defines, so it stays in sync
 * automatically if tabs are added/renamed/reordered.
 */
export function BottomNavigation({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Routes registered with `options={{ href: null }}` (e.g. a redirect-only
  // "index" route inside this group) opt out of the tab bar entirely — the
  // default Tabs tab bar honors that automatically, but a custom `tabBar`
  // has to filter it out itself, or it shows up as an extra unwanted tab.
  const visibleRoutes = state.routes.filter(
    (route) =>
      (descriptors[route.key].options as typeof descriptors[string]["options"] & {
        href?: string | null;
      }).href !== null,
  );
  const focusedKey = state.routes[state.index]?.key;

  return (
    <View style={[styles.wrap, { paddingBottom: (insets.bottom || Theme.spacing.md) + 4 }]}>
      {visibleRoutes.map((route) => {
        const { options } = descriptors[route.key];
        const focused = focusedKey === route.key;
        const label = (typeof options.title === "string" ? options.title : route.name) as string;
        const color = focused ? "#FFFFFF" : Colors.textSecondary;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            style={styles.tab}
          >
            <View style={[styles.iconTile, focused && styles.iconTileActive]}>
              {options.tabBarIcon ? options.tabBarIcon({ focused, color, size: 20 }) : null}
            </View>
            <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  tab: { flex: 1, alignItems: "center", gap: 4 },
  iconTile: {
    width: 40,
    height: 32,
    borderRadius: Theme.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTileActive: { backgroundColor: Colors.accent },
  label: { fontSize: 11, fontWeight: "600", color: Colors.textSecondary },
  labelActive: { color: Colors.accent },
});
