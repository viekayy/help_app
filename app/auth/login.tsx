import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import AuthForm from '@/components/AuthForm';
import { authService } from '@/services/authService';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      if (isLogin) {
        const user = await authService.login(formData.email, formData.password);
        if (user) {
          router.replace('/(tabs)');
        } else {
          Alert.alert('Error', 'Invalid email or password');
        }
      } else {
        await authService.register(formData);
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/6995242/pexels-photo-6995242.jpeg?auto=compress&cs=tinysrgb&w=400' }}
          style={styles.heroImage}
        />
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>Support Network</Text>
          <Text style={styles.subtitle}>
            Connecting those who need help with those who can provide it
          </Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <AuthForm
          isLogin={isLogin}
          onSubmit={handleSubmit}
          loading={loading}
        />

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Text style={styles.switchTextBold}>
              {isLogin ? 'Sign Up' : 'Login'}
            </Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Demo Accounts</Text>
          <Text style={styles.demoText}>Use these credentials to explore different roles:</Text>
          <View style={styles.demoAccounts}>
            <Text style={styles.demoAccount}>NGO: help@v.org / 12345678</Text>
            <Text style={styles.demoAccount}>Donor: donor@v.com / 12345678</Text>
            <Text style={styles.demoAccount}>Victim: victim@v.com / 12345678</Text>
            <Text style={styles.demoAccount}>Consultant: doctor@v.com / 12345678</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    height: 300,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(37, 99, 235, 0.8)',
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 26,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  switchText: {
    fontSize: 16,
    color: '#6B7280',
  },
  switchTextBold: {
    fontWeight: 'bold',
    color: '#2563EB',
  },
  demoSection: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  demoAccounts: {
    gap: 8,
  },
  demoAccount: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'monospace',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
  },
});