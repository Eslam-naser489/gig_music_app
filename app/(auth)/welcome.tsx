// app/(auth)/welcome.tsx
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AuthButton } from "../../components/auth/auth_button";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GIG Music Player</Text>
      <Text style={styles.subtitle}>
        Discover and enjoy your favorite music seamlessly.
      </Text>

      <View style={styles.buttonContainer}>
        <AuthButton
          title="Log In"
          onPress={() => router.push("/(auth)/sign_in")}
        />
        <AuthButton
          title="Sign Up"
          onPress={() => router.push("/(auth)/sign_up")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#171827",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#68412D",
    marginBottom: 48,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
});
