import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { dataService } from '@/services/dataService';
import { User } from '@/types';
import UserCard from '@/components/UserCard';
import { Heart, Scale, Brain } from 'lucide-react-native';

export default function ConsultantsScreen() {
  const [consultants, setConsultants] = useState<User[]>([]);

  useEffect(() => {
    const allConsultants = dataService.getUsersByRole('consultant');
    setConsultants(allConsultants);
  }, []);

  const getSpecializationGroups = () => {
    const groups = {
      medical: consultants.filter(c => c.specialization === 'medical'),
      legal: consultants.filter(c => c.specialization === 'legal'),
      psychological: consultants.filter(c => c.specialization === 'psychological'),
      general: consultants.filter(c => !c.specialization),
    };
    return groups;
  };

  const renderConsultantGroup = (
    title: string,
    consultants: User[],
    icon: React.ReactNode,
    color: string
  ) => {
    if (consultants.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          {icon}
          <Text style={styles.sectionTitle}>{title} ({consultants.length})</Text>
        </View>
        {consultants.map((consultant) => (
          <UserCard key={consultant.id} user={consultant} />
        ))}
      </View>
    );
  };

  const groups = getSpecializationGroups();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Consultant Network</Text>
        <Text style={styles.subtitle}>
          Professional consultants available to help
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {renderConsultantGroup(
          'Medical Professionals',
          groups.medical,
          <Heart size={20} color="#EF4444" />,
          '#EF4444'
        )}
        
        {renderConsultantGroup(
          'Legal Experts',
          groups.legal,
          <Scale size={20} color="#3B82F6" />,
          '#3B82F6'
        )}
        
        {renderConsultantGroup(
          'Psychological Support',
          groups.psychological,
          <Brain size={20} color="#8B5CF6" />,
          '#8B5CF6'
        )}
        
        {renderConsultantGroup(
          'General Consultants',
          groups.general,
          <Heart size={20} color="#10B981" />,
          '#10B981'
        )}

        {consultants.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No consultants available at the moment
            </Text>
          </View>
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
});