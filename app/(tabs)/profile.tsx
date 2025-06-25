import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { authService } from '@/services/authService';
import { User } from '@/types';
import { LogOut, MapPin, Phone, Mail, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            authService.logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const getRoleColor = () => {
    if (!user) return '#6B7280';
    switch (user.role) {
      case 'ngo':
        return '#8B5CF6';
      case 'consultant':
        return '#3B82F6';
      case 'victim':
        return '#EF4444';
      case 'donor':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getRoleLabel = () => {
    if (!user) return '';
    switch (user.role) {
      case 'ngo':
        return 'NGO Organization';
      case 'consultant':
        return 'Professional Consultant';
      case 'victim':
        return 'Seeking Help';
      case 'donor':
        return 'Generous Donor';
      default:
        return user.role;
    }
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: getRoleColor() }]}>
          <Text style={styles.avatarText}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
            {user.verified && (
              <CheckCircle size={20} color="#10B981" />
            )}
          </View>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor() }]}>
            <Text style={styles.roleText}>{getRoleLabel()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Mail size={20} color="#6B7280" />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Phone size={20} color="#6B7280" />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
          {user.location && (
            <View style={styles.infoRow}>
              <MapPin size={20} color="#6B7280" />
              <Text style={styles.infoText}>{user.location}</Text>
            </View>
          )}
        </View>
      </View>

      {user.specialization && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialization</Text>
          <View style={styles.infoCard}>
            <Text style={styles.specializationText}>{user.specialization}</Text>
          </View>
        </View>
      )}

      {user.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoCard}>
            <Text style={styles.descriptionText}>{user.description}</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 8,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  specializationText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  descriptionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 8,
  },
});