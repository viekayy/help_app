import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { UserRole } from '@/types';
import { User, Mail, Phone, MapPin, FileText } from 'lucide-react-native';

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export default function AuthForm({ isLogin, onSubmit, loading }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'victim' as UserRole,
    location: '',
    specialization: '',
    description: '',
  });

  const roles = [
    { label: 'Victim', value: 'victim', description: 'Seeking help and support', color: '#EF4444' },
    { label: 'Donor', value: 'donor', description: 'Providing financial assistance', color: '#10B981' },
    { label: 'Consultant', value: 'consultant', description: 'Professional helper', color: '#3B82F6' },
    { label: 'NGO', value: 'ngo', description: 'Organization providing support', color: '#8B5CF6' },
  ];

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Sign in to continue' : 'Join our support network'}
        </Text>
        
        <View style={styles.inputContainer}>
          <Mail size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {!isLogin && (
          <>
            <View style={styles.inputContainer}>
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Phone size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Select Your Role</Text>
              <View style={styles.roleGrid}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    style={[
                      styles.roleCard,
                      formData.role === role.value && { 
                        borderColor: role.color,
                        backgroundColor: `${role.color}10`
                      }
                    ]}
                    onPress={() => setFormData({ ...formData, role: role.value as UserRole })}
                  >
                    <Text style={[
                      styles.roleTitle,
                      formData.role === role.value && { color: role.color }
                    ]}>
                      {role.label}
                    </Text>
                    <Text style={styles.roleDescription}>{role.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Location (City, State)"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {formData.role === 'consultant' && (
              <>
                <View style={styles.inputContainer}>
                  <FileText size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Specialization (medical/legal/psychological)"
                    value={formData.specialization}
                    onChangeText={(text) => setFormData({ ...formData, specialization: text })}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Brief description of your expertise and experience"
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor="#9CA3AF"
                />
              </>
            )}

            {formData.role === 'ngo' && (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Organization description and mission"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
              />
            )}
          </>
        )}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#6B7280',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#111827',
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  roleCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  roleDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});