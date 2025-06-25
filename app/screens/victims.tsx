import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { dataService } from '@/services/dataService';
import { authService } from '@/services/authService';
import { User } from '@/types';
import UserCard from '@/components/UserCard';
import DonationForm from '@/components/DonationForm';

export default function VictimsScreen() {
  const [victims, setVictims] = useState<User[]>([]);
  const [selectedVictim, setSelectedVictim] = useState<User | null>(null);
  const [showDonationForm, setShowDonationForm] = useState(false);

  useEffect(() => {
    const victimsWithRequests = dataService.getVictimsWithRequests();
    setVictims(victimsWithRequests);
  }, []);

  const handleDonate = (victim: User) => {
    setSelectedVictim(victim);
    setShowDonationForm(true);
  };

  const handleDonationSubmit = (amount: number, message: string) => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && selectedVictim) {
      dataService.createDonation({
        donorId: currentUser.id,
        recipientId: selectedVictim.id,
        recipientType: 'victim',
        amount,
        message,
      });
      setShowDonationForm(false);
      setSelectedVictim(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>People Who Need Help</Text>
        <Text style={styles.subtitle}>
          Directly support individuals seeking assistance
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {victims.map((victim) => (
          <UserCard
            key={victim.id}
            user={victim}
            showDonateButton={true}
            onDonate={handleDonate}
          />
        ))}
      </ScrollView>

      <Modal
        visible={showDonationForm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDonationForm(false)}
      >
        <View style={styles.modalOverlay}>
          {selectedVictim && (
            <DonationForm
              recipient={selectedVictim}
              onSubmit={handleDonationSubmit}
              onCancel={() => setShowDonationForm(false)}
            />
          )}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
});