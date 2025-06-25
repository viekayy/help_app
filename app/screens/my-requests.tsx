import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { dataService } from '@/services/dataService';
import { authService } from '@/services/authService';
import { HelpRequest } from '@/types';
import RequestCard from '@/components/RequestCard';

export default function MyRequestsScreen() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const userRequests = dataService.getRequestsByVictim(currentUser.id);
      setRequests(userRequests);
    }
  }, []);

  const groupedRequests = {
    pending: requests.filter(r => r.status === 'pending'),
    assigned: requests.filter(r => r.status === 'assigned'),
    inProgress: requests.filter(r => r.status === 'in-progress'),
    completed: requests.filter(r => r.status === 'completed'),
  };

  const renderRequestGroup = (title: string, requests: HelpRequest[], color: string) => {
    if (requests.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.statusIndicator, { backgroundColor: color }]} />
          <Text style={styles.sectionTitle}>{title} ({requests.length})</Text>
        </View>
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Requests</Text>
        <Text style={styles.subtitle}>
          Track the status of your help requests
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              You haven't submitted any requests yet
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Use the "New Request" tab to ask for help
            </Text>
          </View>
        ) : (
          <>
            {renderRequestGroup('Pending', groupedRequests.pending, '#F59E0B')}
            {renderRequestGroup('Assigned', groupedRequests.assigned, '#8B5CF6')}
            {renderRequestGroup('In Progress', groupedRequests.inProgress, '#3B82F6')}
            {renderRequestGroup('Completed', groupedRequests.completed, '#10B981')}
          </>
        )}
      </ScrollView>
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});