import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomButton } from '../../components/CustomButton';
import { InputField } from '../../components/InputField';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      await login({ email, password });
      router.replace('/(drawer)/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials or server error');
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
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to continue listening</Text>
        </View>

        <View style={styles.form}>
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
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.footer}>
          <CustomButton
            title="Log In"
            onPress={handleLogin}
            isLoading={isLoading}
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.switchText}>
            Don't have an account?{' '}
            <Text 
              style={styles.switchLink}
              onPress={() => router.push('/(auth)/signup')}
            >
              Sign Up
            </Text>
          </Text>
        </View>
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
    marginTop: 40,
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
