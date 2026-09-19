import { useState } from "react";
import { KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme_context";
import { Typography } from "@/constants/Typography";
import { Theme } from "@/constants/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

interface ContactChannel {
  icon: IconName;
  label: string;
  value: string;
  onPress: () => void;
}

const CHANNELS: ContactChannel[] = [
  {
    icon: "mail-outline",
    label: "Email",
    value: "support@gigmusicplayer.app",
    onPress: () => Linking.openURL("mailto:support@gigmusicplayer.app"),
  },
  {
    icon: "logo-instagram",
    label: "Instagram",
    value: "@gigmusicplayer",
    onPress: () => Linking.openURL("https://instagram.com/gigmusicplayer"),
  },
  {
    icon: "logo-twitter",
    label: "Twitter / X",
    value: "@gigmusicplayer",
    onPress: () => Linking.openURL("https://twitter.com/gigmusicplayer"),
  },
];

/**
 * Contact Us screen — owned by the Infrastructure & Layout member.
 * The message form is local-only (no backend contact endpoint exists
 * yet); submitting just shows an inline confirmation.
 */
export default function ContactUsScreen() {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const canSend = name.trim().length > 0 && email.trim().length > 0 && message.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title="Contact Us" showBack colors={colors} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={[Typography.body, styles.intro, { color: colors.textSecondary }]}>
          Questions, feedback, or something not working right? We usually reply within a day.
        </Text>

        <View style={styles.channels}>
          {CHANNELS.map((channel) => (
            <Card key={channel.label} variant="outline" style={styles.channelCard} colors={colors} onPress={channel.onPress}>
              <View style={styles.channelRow}>
                <View style={[styles.channelIconTile, { backgroundColor: colors.accentLight }]}>
                  <Ionicons name={channel.icon} size={18} color={colors.accent} />
                </View>
                <View style={styles.channelTextWrap}>
                  <Text style={[Typography.bodyBold, { color: colors.textPrimary }]}>{channel.label}</Text>
                  <Text style={[Typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>{channel.value}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </View>
            </Card>
          ))}
        </View>

        <Text style={[Typography.bodyBold, styles.sectionTitle, { color: colors.textPrimary }]}>Send us a message</Text>
        <Card variant="outline" style={styles.formCard} colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textTertiary}
          />
          <View style={[styles.inputDivider, { backgroundColor: colors.border }]} />
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Your email"
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={[styles.inputDivider, { backgroundColor: colors.border }]} />
          <TextInput
            style={[styles.input, styles.messageInput, { color: colors.textPrimary }]}
            value={message}
            onChangeText={setMessage}
            placeholder="How can we help?"
            placeholderTextColor={colors.textTertiary}
            multiline
            textAlignVertical="top"
          />
        </Card>

        <View style={styles.sendWrap}>
          <Button label="Send Message" onPress={handleSend} disabled={!canSend} fullWidth icon="send" colors={colors} />
        </View>

        {sent ? (
          <View style={styles.confirmation}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={[styles.confirmationText, { color: colors.success }]}>Thanks — your message has been noted.</Text>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: Theme.spacing.lg, paddingBottom: 48 },
  intro: { marginBottom: Theme.spacing.xl },
  channels: { gap: Theme.spacing.sm },
  channelCard: { padding: 0 },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  channelIconTile: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  channelTextWrap: { flex: 1 },
  sectionTitle: { marginTop: Theme.spacing.xxl, marginBottom: Theme.spacing.sm },
  formCard: { padding: 0 },
  input: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    fontSize: 15,
  },
  messageInput: { minHeight: 100 },
  inputDivider: { height: 1, marginHorizontal: Theme.spacing.lg },
  sendWrap: { marginTop: Theme.spacing.xl },
  confirmation: {
    marginTop: Theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    justifyContent: "center",
  },
  confirmationText: { fontSize: 12, fontWeight: "600" },
});
