import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { dataService } from '@/services/dataService';
import { authService } from '@/services/authService';
import { RequestType } from '@/types';
import { Heart, Scale, DollarSign } from 'lucide-react-native';

export default function NewRequestScreen() {
  const [formData, setFormData] = useState({
    type: 'medical' as RequestType,
    title: '',
    description: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    amount: '',
  });

  const requestTypes = [
    { value: 'medical', label: 'Medical Help', icon: Heart, color: '#EF4444' },
    { value: 'legal', label: 'Legal Advice', icon: Scale, color: '#3B82F6' },
    { value: 'money', label: 'Financial Aid', icon: DollarSign, color: '#10B981' },
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'high', label: 'High', color: '#EF4444' },
  ];

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    const requestData = {
      victimId: currentUser.id,
      type: formData.type,
      title: formData.title.trim(),
      description: formData.description.trim(),
      urgency: formData.urgency,
      status: 'pending' as const,
      ...(formData.type === 'money' && formData.amount ? { amount: parseFloat(formData.amount) } : {}),
    };

    dataService.createRequest(requestData);
    Alert.alert('Success', 'Your request has been submitted successfully', [
      { text: 'OK', onPress: () => router.push('/my-requests') }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Request</Text>
        <Text style={styles.subtitle}>
          Let us know how we can help you
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Type of Help Needed *</Text>
        <View style={styles.typeButtons}>
          {requestTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  formData.type === type.value && { backgroundColor: type.color }
                ]}
                onPress={() => setFormData({ ...formData, type: type.value as RequestType })}
              >
                <IconComponent 
                  size={24} 
                  color={formData.type === type.value ? '#FFFFFF' : type.color} 
                />
                <Text style={[
                  styles.typeButtonText,
                  formData.type === type.value && { color: '#FFFFFF' }
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Request Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Brief description of what you need"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />

        <Text style={styles.label}>Detailed Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Please provide more details about your situation and what kind of help you need"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
        />

        {formData.type === 'money' && (
          <>
            <Text style={styles.label}>Amount Needed (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount in USD"
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
              keyboardType="numeric"
            />
          </>
        )}

        <Text style={styles.label}>Urgency Level</Text>
        <View style={styles.urgencyButtons}>
          {urgencyLevels.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.urgencyButton,
                formData.urgency === level.value && { backgroundColor: level.color }
              ]}
              onPress={() => setFormData({ ...formData, urgency: level.value as any })}
            >
              <Text style={[
                styles.urgencyButtonText,
                formData.urgency === level.value && { color: '#FFFFFF' }
              ]}>
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Request</Text>
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
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 8,
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  urgencyButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  urgencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});