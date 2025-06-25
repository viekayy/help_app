import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { dataService } from '@/services/dataService';
import { authService } from '@/services/authService';
import { HelpRequest, Consultation } from '@/types';
import { Calendar, Clock, User } from 'lucide-react-native';

export default function ScheduleScreen() {
  const [scheduledRequests, setScheduledRequests] = useState<HelpRequest[]>([]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const requests = dataService.getRequestsByConsultant(currentUser.id)
        .filter(req => req.scheduledDate);
      setScheduledRequests(requests);
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return '#8B5CF6';
      case 'in-progress':
        return '#3B82F6';
      case 'completed':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const todayConsultations = scheduledRequests.filter(req => {
    if (!req.scheduledDate) return false;
    const today = new Date().toDateString();
    const consultationDate = new Date(req.scheduledDate).toDateString();
    return today === consultationDate;
  });

  const upcomingConsultations = scheduledRequests.filter(req => {
    if (!req.scheduledDate) return false;
    const today = new Date();
    const consultationDate = new Date(req.scheduledDate);
    return consultationDate > today;
  });

  const renderConsultationCard = (request: HelpRequest) => (
    <View key={request.id} style={styles.consultationCard}>
      <View style={styles.consultationHeader}>
        <View style={styles.consultationInfo}>
          <Text style={styles.consultationTitle}>{request.title}</Text>
          <Text style={styles.consultationType}>{request.type.toUpperCase()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
          <Text style={styles.statusText}>{request.status}</Text>
        </View>
      </View>

      <Text style={styles.consultationDescription}>{request.description}</Text>

      <View style={styles.consultationDetails}>
        <View style={styles.detailRow}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {formatDate(request.scheduledDate!)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {formatTime(request.scheduledDate!)}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Join Consultation</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Schedule</Text>
        <Text style={styles.subtitle}>
          Manage your consultation appointments
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {todayConsultations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Consultations</Text>
            {todayConsultations.map(renderConsultationCard)}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Consultations</Text>
          {upcomingConsultations.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No upcoming consultations scheduled
              </Text>
            </View>
          ) : (
            upcomingConsultations.map(renderConsultationCard)
          )}
        </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  consultationCard: {
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
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  consultationInfo: {
    flex: 1,
  },
  consultationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  consultationType: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  consultationDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  consultationDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  joinButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});