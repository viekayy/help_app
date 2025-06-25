import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import { User } from '@/types';

interface DonationFormProps {
  recipient: User;
  onSubmit: (amount: number, message: string) => void;
  onCancel: () => void;
}

export default function DonationForm({ recipient, onSubmit, onCancel }: DonationFormProps) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const predefinedAmounts = [50, 100, 250, 500, 1000];

  const handleSubmit = () => {
    const donationAmount = parseFloat(amount);
    if (!donationAmount || donationAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    onSubmit(donationAmount, message);
  };

  return (
<TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => Keyboard.dismiss()}>

      <Text style={styles.title}>Donate to {recipient.name}</Text>
      
      <Text style={styles.label}>Select Amount</Text>
      <View style={styles.amountButtons}>
        {predefinedAmounts.map((preset) => (
          <TouchableOpacity
            key={preset}
            style={[
              styles.amountButton,
              amount === preset.toString() && styles.amountButtonActive
            ]}
            onPress={() => setAmount(preset.toString())}
          >
            <Text style={[
              styles.amountButtonText,
              amount === preset.toString() && styles.amountButtonTextActive
            ]}>
              ${preset}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Custom Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Message (Optional)</Text>
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Add a supportive message..."
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={3}
      />

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.donateButton}
          onPress={handleSubmit}
        >
          <Text style={styles.donateButtonText}>Donate ${amount || '0'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#111827',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  amountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  amountButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  amountButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  amountButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  amountButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttons: {
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
  donateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  donateButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});