import { useEffect, useRef } from "react";
import { Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import { useSideMenu } from "@/context/side_menu_context";
import { useTheme } from "@/context/theme_context";
import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/constants/colors";
import { Theme } from "@/constants/theme";
import { Routes } from "@/constants/routes";

/**
 * SideMenu — global navigation drawer (components/layout).
 * Mounted once in `app/_layout.tsx`; opened from anywhere via
 * `useSideMenu().show()` (the shared `Header` already wires this up).
 * Matches the Figma flow: Home · Search · Liked Songs · Playlists ·
 * Contact Us · Learn More · Settings, plus a dark-mode switch.
 */

type IconName = ComponentProps<typeof Ionicons>["name"];

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(300, SCREEN_WIDTH * 0.8);

interface MenuItem {
  key: string;
  label: string;
  icon: IconName;
  href: string;
}

const MENU_ITEMS: MenuItem[] = [
  { key: "home", label: "Home", icon: "home-outline", href: Routes.home },
  { key: "search", label: "Search", icon: "search-outline", href: Routes.search },
  { key: "liked", label: "Liked Songs", icon: "heart-outline", href: Routes.likedSongs },
  { key: "playlists", label: "Playlists", icon: "albums-outline", href: Routes.playlists },
];

const SUPPORT_ITEMS: MenuItem[] = [
  { key: "settings", label: "Settings", icon: "settings-outline", href: "/setting" },
  { key: "contact", label: "Contact Us", icon: "mail-outline", href: "/contact_us" },
  { key: "learn", label: "Learn More", icon: "information-circle-outline", href: "/learn_more" },
];

export function SideMenu() {
  const { visible, hide } = useSideMenu();
  const { isDark, toggleDark } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -DRAWER_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible, translateX]);

  const navigateTo = (href: string) => {
    hide();
    router.push(href as any);
  };

  const handleSignOut = async () => {
    hide();
    await logout();
    router.replace("/(auth)/onboarding" as any);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={hide} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={hide} accessibilityLabel="Close menu" accessibilityRole="button" />

      <Animated.View style={[styles.drawer, { width: DRAWER_WIDTH, transform: [{ translateX }] }]}>
        <View style={styles.brandRow}>
          <View style={styles.brandTile}>
            <Ionicons name="musical-notes" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.brandTextWrap}>
            <Text style={styles.brandText} numberOfLines={1}>
              GIG Music Player
            </Text>
            {user ? (
              <Text style={styles.brandSubtext} numberOfLines={1}>
                {user.username || user.email}
              </Text>
            ) : null}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.itemsList}>
          {MENU_ITEMS.map((item) => (
            <MenuRow key={item.key} item={item} active={pathname === item.href} onPress={() => navigateTo(item.href)} />
          ))}

          <View style={styles.divider} />

          {SUPPORT_ITEMS.map((item) => (
            <MenuRow key={item.key} item={item} active={pathname === item.href} onPress={() => navigateTo(item.href)} />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.darkModeRow}>
            <View style={styles.darkModeLabelRow}>
              <Ionicons name={isDark ? "moon" : "moon-outline"} size={18} color={Colors.menuSurfaceTextSoft} />
              <Text style={styles.darkModeLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleDark}
              trackColor={{ false: "rgba(255,255,255,0.18)", true: Colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          {user ? (
            <Pressable
              onPress={handleSignOut}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
              style={({ pressed }) => [styles.signOutRow, pressed && styles.itemRowPressed]}
            >
              <Ionicons name="log-out-outline" size={18} color={Colors.error} />
              <Text style={styles.signOutLabel}>Sign Out</Text>
            </Pressable>
          ) : null}
        </View>
      </Animated.View>
    </Modal>
  );
}

function MenuRow({ item, active, onPress }: { item: MenuItem; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      style={({ pressed }) => [styles.itemRow, active && styles.itemRowActive, pressed && styles.itemRowPressed]}
    >
      <Ionicons name={item.icon} size={20} color={active ? "#FFFFFF" : Colors.menuSurfaceTextSoft} />
      <Text style={[styles.itemLabel, active && styles.itemLabelActive]}>{item.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.overlay },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.menuSurface,
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.xxxl,
    paddingBottom: Theme.spacing.xl,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 6, height: 0 },
    elevation: 12,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: Theme.spacing.md, marginBottom: Theme.spacing.xxl },
  brandTile: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTextWrap: { flex: 1 },
  brandText: { color: Colors.menuSurfaceText, fontSize: 15, fontWeight: "800" },
  brandSubtext: { color: Colors.menuSurfaceTextSoft, fontSize: 12, marginTop: 2 },
  itemsList: { gap: 4, paddingBottom: Theme.spacing.xl },
  divider: { height: 1, backgroundColor: Colors.menuSurfaceBorder, marginVertical: Theme.spacing.md },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    paddingVertical: 12,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  itemRowActive: { backgroundColor: "rgba(255,255,255,0.08)" },
  itemRowPressed: { opacity: 0.7 },
  itemLabel: { color: Colors.menuSurfaceTextSoft, fontSize: 14, fontWeight: "600" },
  itemLabelActive: { color: "#FFFFFF" },
  footer: { borderTopWidth: 1, borderTopColor: Colors.menuSurfaceBorder, paddingTop: Theme.spacing.lg, gap: Theme.spacing.md },
  darkModeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  darkModeLabelRow: { flexDirection: "row", alignItems: "center", gap: Theme.spacing.sm },
  darkModeLabel: { color: Colors.menuSurfaceTextSoft, fontSize: 13, fontWeight: "600" },
  signOutRow: { flexDirection: "row", alignItems: "center", gap: Theme.spacing.sm, paddingVertical: 6 },
  signOutLabel: { color: Colors.error, fontSize: 13, fontWeight: "700" },
});
