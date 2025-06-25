import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { authService } from '@/services/authService';
import { dataService } from '@/services/dataService';
import { User } from '@/types';
import RequestCard from '@/components/RequestCard';
import UserCard from '@/components/UserCard';

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    assignedRequests: 0,
    completedRequests: 0,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      const allRequests = dataService.getAllRequests();
      setStats({
        totalRequests: allRequests.length,
        pendingRequests: allRequests.filter(r => r.status === 'pending').length,
        assignedRequests: allRequests.filter(r => r.status === 'assigned').length,
        completedRequests: allRequests.filter(r => r.status === 'completed').length,
      });
    }
  }, []);

  const getWelcomeMessage = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'donor':
        return 'Thank you for your generous support';
      case 'victim':
        return 'You are not alone. Help is available';
      case 'consultant':
        return 'Your expertise makes a difference';
      case 'ngo':
        return 'Managing support for those in need';
      default:
        return 'Welcome to Support Network';
    }
  };

  const renderRoleSpecificContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'donor':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Impact Overview</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.totalRequests}</Text>
                <Text style={styles.statLabel}>Total Requests</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.pendingRequests}</Text>
                <Text style={styles.statLabel}>Need Help</Text>
              </View>
            </View>
          </View>
        );

      case 'victim':
        const myRequests = dataService.getRequestsByVictim(user.id);
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Recent Requests</Text>
            {myRequests.slice(0, 2).map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </View>
        );

      case 'consultant':
        const myAssignedRequests = dataService.getRequestsByConsultant(user.id);
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Assigned Cases</Text>
            {myAssignedRequests.slice(0, 2).map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </View>
        );

      case 'ngo':
        const pendingRequests = dataService.getPendingRequests();
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Requests</Text>
            {pendingRequests.slice(0, 2).map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.subtitle}>{getWelcomeMessage()}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.pendingRequests}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.assignedRequests}</Text>
          <Text style={styles.statLabel}>Assigned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completedRequests}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {renderRoleSpecificContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
});