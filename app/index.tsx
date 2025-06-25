import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { authService } from '@/services/authService';

export default function IndexScreen() {
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/auth/login');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        router.replace('/auth/login');
      }
    };

    checkAuthAndRedirect();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});