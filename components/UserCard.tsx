import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User } from '@/types';
import { MapPin, Phone, CircleCheck as CheckCircle } from 'lucide-react-native';

interface UserCardProps {
  user: User;
  onPress?: (user: User) => void;
  showDonateButton?: boolean;
  onDonate?: (user: User) => void;
}

export default function UserCard({ user, onPress, showDonateButton, onDonate }: UserCardProps) {
  const getRoleColor = () => {
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
    switch (user.role) {
      case 'ngo':
        return 'NGO';
      case 'consultant':
        return 'Consultant';
      case 'victim':
        return 'Needs Help';
      case 'donor':
        return 'Donor';
      default:
        return user.role;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(user)}
      activeOpacity={0.7}
    >
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
              <CheckCircle size={16} color="#10B981" />
            )}
          </View>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor() }]}>
            <Text style={styles.roleText}>{getRoleLabel()}</Text>
          </View>
        </View>
      </View>

      {user.description && (
        <Text style={styles.description} numberOfLines={2}>
          {user.description}
        </Text>
      )}

      {user.specialization && (
        <Text style={styles.specialization}>
          Specialization: {user.specialization}
        </Text>
      )}

      <View style={styles.details}>
        {user.location && (
          <View style={styles.detailItem}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.detailText}>{user.location}</Text>
          </View>
        )}
        <View style={styles.detailItem}>
          <Phone size={14} color="#6B7280" />
          <Text style={styles.detailText}>{user.phone}</Text>
        </View>
      </View>

      {showDonateButton && (
        <TouchableOpacity
          style={styles.donateButton}
          onPress={() => onDonate?.(user)}
        >
          <Text style={styles.donateButtonText}>Donate</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  specialization: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  donateButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  donateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});