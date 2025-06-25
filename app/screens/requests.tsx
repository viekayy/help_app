import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { dataService } from '@/services/dataService';
import { authService } from '@/services/authService';
import { HelpRequest } from '@/types';
import RequestCard from '@/components/RequestCard';
import { Calendar, Clock } from 'lucide-react-native';

export default function RequestsScreen() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const userRequests = dataService.getRequestsByConsultant(currentUser.id);
      const pendingRequests = dataService.getPendingRequests().filter(req => {
        if (currentUser.specialization) {
          return req.type === currentUser.specialization;
        }
        return true;
      });
      setRequests([...userRequests, ...pendingRequests]);
    }
  }, []);

  const handleRespond = (request: HelpRequest) => {
    setSelectedRequest(request);
    setShowScheduleModal(true);
  };

  const handleScheduleConsultation = () => {
    if (!selectedRequest || !scheduledDate) {
      Alert.alert('Error', 'Please select a date and time');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    dataService.updateRequest(selectedRequest.id, {
      status: 'assigned',
      assignedConsultantId: currentUser.id,
      scheduledDate,
    });

    dataService.scheduleConsultation({
      requestId: selectedRequest.id,
      consultantId: currentUser.id,
      victimId: selectedRequest.victimId,
      scheduledDate,
      notes,
      status: 'scheduled',
    });

    setShowScheduleModal(false);
    setSelectedRequest(null);
    setScheduledDate('');
    setNotes('');

    Alert.alert('Success', 'Consultation scheduled successfully');
  };

  const assignedRequests = requests.filter(r => r.status === 'assigned' || r.status === 'in-progress');
  const availableRequests = requests.filter(r => r.status === 'pending');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Request Management</Text>
        <Text style={styles.subtitle}>
          Respond to requests and manage consultations
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {assignedRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>My Assigned Cases</Text>
            </View>
            {assignedRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Available Requests</Text>
          </View>
          {availableRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No pending requests in your specialization
              </Text>
            </View>
          ) : (
            availableRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                showActions={true}
                onRespond={handleRespond}
              />
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showScheduleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Schedule Consultation</Text>
            
            <Text style={styles.label}>Date & Time</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD HH:MM"
              value={scheduledDate}
              onChangeText={setScheduledDate}
            />

            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any notes about the consultation..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowScheduleModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={handleScheduleConsultation}
              >
                <Text style={styles.scheduleButtonText}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#111827',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  scheduleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  scheduleButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});