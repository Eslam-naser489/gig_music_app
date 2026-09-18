import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme_context";
import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/constants/colors";
import { Typography } from "@/constants/Typography";
import { Theme } from "@/constants/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

/**
 * Settings screen — owned by the Infrastructure & Layout member.
 * Notification preferences are local UI state for now (no backend
 * endpoint exists yet); Dark Mode and Sign Out are fully wired.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleDark } = useTheme();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [downloadOverWifi, setDownloadOverWifi] = useState(true);

  const handleSignOut = async () => {
    await logout();
    router.replace("/(auth)/onboarding" as any);
  };

  return (
    <View style={styles.screen}>
      <Header title="Settings" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {user ? (
          <Card variant="outline" style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{(user.username || user.email || "?").charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.profileTextWrap}>
                <Text style={[Typography.bodyBold, { color: Colors.textPrimary }]} numberOfLines={1}>
                  {user.username || "Music lover"}
                </Text>
                <Text style={[Typography.caption, { color: Colors.textSecondary }]} numberOfLines={1}>
                  {user.email}
                </Text>
              </View>
            </View>
          </Card>
        ) : null}

        <SectionLabel label="Appearance" />
        <Card variant="outline" style={styles.card}>
          <SettingRow
            icon={isDark ? "moon" : "moon-outline"}
            label="Dark Mode"
            description="Matches the switch in the side menu"
            value={isDark}
            onValueChange={toggleDark}
          />
        </Card>

        <SectionLabel label="Notifications" />
        <Card variant="outline" style={styles.card}>
          <SettingRow
            icon="notifications-outline"
            label="Push Notifications"
            description="New releases and playlist updates"
            value={notifications}
            onValueChange={setNotifications}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            icon="cloud-download-outline"
            label="Download Over Wi-Fi Only"
            value={downloadOverWifi}
            onValueChange={setDownloadOverWifi}
          />
        </Card>

        <SectionLabel label="Support" />
        <Card variant="outline" style={styles.card} onPress={() => router.push("/contact_us" as any)}>
          <LinkRow icon="mail-outline" label="Contact Us" />
        </Card>
        <Card variant="outline" style={styles.card} onPress={() => router.push("/learn_more" as any)}>
          <LinkRow icon="information-circle-outline" label="Learn More" />
        </Card>

        <View style={styles.signOutWrap}>
          <Button label="Sign Out" variant="outline" icon="log-out-outline" fullWidth onPress={handleSignOut} />
        </View>

        <Text style={styles.version}>GIG Music Player · v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label.toUpperCase()}</Text>;
}

interface SettingRowProps {
  icon: IconName;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function SettingRow({ icon, label, description, value, onValueChange }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIconTile}>
        <Ionicons name={icon} size={18} color={Colors.accent} />
      </View>
      <View style={styles.settingTextWrap}>
        <Text style={[Typography.bodyBold, { color: Colors.textPrimary }]}>{label}</Text>
        {description ? <Text style={[Typography.caption, { color: Colors.textSecondary, marginTop: 2 }]}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border, true: Colors.accent }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function LinkRow({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.linkRow}>
      <View style={styles.settingIconTile}>
        <Ionicons name={icon} size={18} color={Colors.accent} />
      </View>
      <Text style={[Typography.bodyBold, { color: Colors.textPrimary, flex: 1 }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Theme.spacing.lg, paddingBottom: 48 },
  profileCard: { marginBottom: Theme.spacing.md },
  profileRow: { flexDirection: "row", alignItems: "center", gap: Theme.spacing.md },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: Colors.textInverse, fontWeight: "800", fontSize: 18 },
  profileTextWrap: { flex: 1 },
  sectionLabel: {
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.sm,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: Colors.textTertiary,
  },
  card: { padding: 0 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.lg,
  },
  rowDivider: { height: 1, backgroundColor: Colors.border, marginLeft: Theme.spacing.lg + 34 + Theme.spacing.md },
  settingIconTile: {
    width: 34,
    height: 34,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  settingTextWrap: { flex: 1 },
  signOutWrap: { marginTop: Theme.spacing.xxl },
  version: { marginTop: Theme.spacing.xxl, textAlign: "center", fontSize: 12, color: Colors.textTertiary },
});
