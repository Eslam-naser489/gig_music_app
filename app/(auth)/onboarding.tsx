import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { CustomButton } from '../../components/CustomButton';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Music2 } from 'lucide-react-native';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Small top text */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>let's start</Text>
      </View>

      <View style={styles.content}>
        {/* Image container with dark overlay effect */}
        <View style={styles.imageWrapper}>
          <Image 
            source={require('../../assets/images/spongebob_music.jpg')} 
            style={styles.image}
            resizeMode="cover"
          />
          {/* Gradient fade at bottom to blend with background */}
          <View style={styles.imageBottomFade} />
        </View>
        
        <Text style={styles.title}>GIG Music</Text>
        <Text style={styles.subtitle}>
          A sleek, modern music app that brings your favorite songs, artists, and playlists together
        </Text>
      </View>

      <View style={styles.footer}>
        <CustomButton
          title="Let's Start"
          onPress={() => router.push('/(auth)/login')}
          style={styles.startButton}
          textStyle={{ color: Colors.white }}
          rightIcon={<ArrowRight size={20} color={Colors.white} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E222A',
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  topBarText: {
    color: '#A0AAB8',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  imageWrapper: {
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: 'hidden',
    marginBottom: 40,
    position: 'relative',
    borderWidth: 3,
    borderColor: '#C84B31',
    shadowColor: '#C84B31',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 120,
  },
  imageBottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(30, 34, 42, 0.5)',
  },
  title: {
    ...Typography.header,
    color: '#F5F7FA',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    ...Typography.body,
    color: '#A0AAB8',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  startButton: {
    backgroundColor: '#C84B31',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 10,
  }
});
