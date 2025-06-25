import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { dataService } from '@/services/dataService';
import { HelpRequest, User } from '@/types';
import RequestCard from '@/components/RequestCard';
import UserCard from '@/components/UserCard';
import { Users, FileText } from 'lucide-react-native';

export default function CasesScreen() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [consultants, setConsultants] = useState<User[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    const allRequests = dataService.getAllRequests();
    const allConsultants = dataService.getUsersByRole('consultant');
    setRequests(allRequests);
    setConsultants(allConsultants);
  }, []);

  const handleAssign = (request: HelpRequest) => {
    setSelectedRequest(request);
    setShowAssignModal(true);
  };

  const handleAssignConsultant = (consultant: User) => {
    if (!selectedRequest) return;

    dataService.updateRequest(selectedRequest.id, {
      status: 'assigned',
      assignedConsultantId: consultant.id,
    });

    setShowAssignModal(false);
    setSelectedRequest(null);
    
    const updatedRequests = dataService.getAllRequests();
    setRequests(updatedRequests);

    Alert.alert('Success', `Request assigned to ${consultant.name}`);
  };

  const getFilteredConsultants = () => {
    if (!selectedRequest) return consultants;
    
    return consultants.filter(consultant => {
      if (consultant.specialization) {
        return consultant.specialization === selectedRequest.type;
      }
      return true;
    });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const assignedRequests = requests.filter(r => r.status === 'assigned' || r.status === 'in-progress');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Case Management</Text>
        <Text style={styles.subtitle}>
          Oversee and assign victim support requests
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>
              Pending Requests ({pendingRequests.length})
            </Text>
          </View>
          {pendingRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No pending requests at the moment
              </Text>
            </View>
          ) : (
            pendingRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                showActions={true}
                onAssign={handleAssign}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>
              Assigned Cases ({assignedRequests.length})
            </Text>
          </View>
          {assignedRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showAssignModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign Consultant</Text>
            <Text style={styles.modalSubtitle}>
              Select a consultant for: {selectedRequest?.title}
            </Text>
            
            <ScrollView style={styles.consultantList}>
              {getFilteredConsultants().map((consultant) => (
                <TouchableOpacity
                  key={consultant.id}
                  onPress={() => handleAssignConsultant(consultant)}
                >
                  <UserCard user={consultant} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAssignModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  consultantList: {
    maxHeight: 400,
    marginBottom: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
});