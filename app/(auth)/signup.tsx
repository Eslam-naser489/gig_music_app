// app/(auth)/signup.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";

const MIN_USERNAME_LENGTH = 3;

// Only accepts a proper "name@gmail.com" address (nothing before the @ is
// blank, and the domain is exactly gmail.com, not e.g. gmail.com.fake.com).
const isValidGmailEmail = (value: string) => /^[^\s@]+@gmail\.com$/i.test(value.trim());

export default function SignupScreen() {
  const router = useRouter();
  const { register, login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (username.trim().length < MIN_USERNAME_LENGTH) {
      Alert.alert("Error", `Username must be at least ${MIN_USERNAME_LENGTH} characters long`);
      return;
    }

    if (!isValidGmailEmail(email)) {
      Alert.alert("Error", "Email must be a valid Gmail address (e.g. name@gmail.com)");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await register({ username, email, password });
      router.replace("/(tabs)/home");
    } catch (error: any) {
      // If register succeeded but returned no token, try logging in
      try {
        await login({ email, password });
        router.replace("/(tabs)/home");
      } catch {
        Alert.alert(
          "Signup Failed",
          error?.message || "Could not create account",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start listening</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              placeholderTextColor={Colors.textTertiary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={Colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Create a password"
                placeholderTextColor={Colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setIsPasswordVisible((prev) => !prev)}
                hitSlop={8}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color={Colors.textSecondary}
                />
              </Pressable>
            </View>

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Repeat your password"
                placeholderTextColor={Colors.textTertiary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!isConfirmPasswordVisible}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setIsConfirmPasswordVisible((prev) => !prev)}
                hitSlop={8}
              >
                <Ionicons
                  name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color={Colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.85 },
              ]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textInverse} />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </Pressable>

            <Text style={styles.switchText}>
              {"Already have an account? "}
              <Text
                style={styles.switchLink}
                onPress={() => router.push("/(auth)/login")}
              >
                Log In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  keyboardView: { flex: 1, padding: 24 },
  header: { marginTop: 40, marginBottom: 32 },
  title: {
    color: Colors.textPrimary,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: { color: Colors.textSecondary, fontSize: 15 },
  form: { marginBottom: 24 },
  label: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  passwordWrapper: {
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 44,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    height: "100%",
    justifyContent: "center",
  },
  footer: { paddingBottom: 20 },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: { color: Colors.textInverse, fontSize: 16, fontWeight: "700" },
  switchText: { color: Colors.textSecondary, textAlign: "center" },
  switchLink: { color: Colors.accent, fontWeight: "700" },
});
