import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomButton } from '../../components/CustomButton';
import { InputField } from '../../components/InputField';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { register, login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      // register() internally calls login() if the API doesn't return a token
      await register({ username, email, password });
      router.replace('/(drawer)/(tabs)');
    } catch (error: any) {
      // If register succeeded but didn't return token, try logging in manually
      try {
        await login({ email, password });
        router.replace('/(drawer)/(tabs)');
      } catch {
        Alert.alert('Signup Failed', error?.message || 'Could not create account. Please try to login manually.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start listening</Text>
          </View>

          <View style={styles.form}>
            <InputField
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <InputField
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <InputField
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <InputField
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.footer}>
            <CustomButton
              title="Sign Up"
              onPress={handleSignup}
              isLoading={isLoading}
              style={{ marginBottom: 16 }}
            />
            <Text style={styles.switchText}>
              Already have an account?{' '}
              <Text 
                style={styles.switchLink}
                onPress={() => router.push('/(auth)/login')}
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    ...Typography.header,
    color: Colors.text,
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  footer: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  switchText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  switchLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  }
});
