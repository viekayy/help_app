import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HelpRequest } from '@/types';
import { Calendar, DollarSign, Heart, Scale } from 'lucide-react-native';

interface RequestCardProps {
  request: HelpRequest;
  onPress?: (request: HelpRequest) => void;
  showActions?: boolean;
  onAssign?: (request: HelpRequest) => void;
  onRespond?: (request: HelpRequest) => void;
}

export default function RequestCard({ 
  request, 
  onPress, 
  showActions, 
  onAssign, 
  onRespond 
}: RequestCardProps) {
  const getTypeIcon = () => {
    switch (request.type) {
      case 'medical':
        return <Heart size={20} color="#EF4444" />;
      case 'legal':
        return <Scale size={20} color="#3B82F6" />;
      case 'money':
        return <DollarSign size={20} color="#10B981" />;
      default:
        return null;
    }
  };

  const getUrgencyColor = () => {
    switch (request.urgency) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = () => {
    switch (request.status) {
      case 'completed':
        return '#10B981';
      case 'in-progress':
        return '#3B82F6';
      case 'assigned':
        return '#8B5CF6';
      case 'pending':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(request)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.typeIcon}>
          {getTypeIcon()}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{request.title}</Text>
          <Text style={styles.type}>{request.type.toUpperCase()}</Text>
        </View>
        <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor() }]}>
          <Text style={styles.urgencyText}>{request.urgency}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {request.description}
      </Text>

      {request.amount && (
        <Text style={styles.amount}>Amount needed: ${request.amount}</Text>
      )}

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.date}>
            {new Date(request.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{request.status}</Text>
        </View>
      </View>

      {showActions && (
        <View style={styles.actions}>
          {onAssign && request.status === 'pending' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onAssign(request)}
            >
              <Text style={styles.actionButtonText}>Assign</Text>
            </TouchableOpacity>
          )}
          {onRespond && (
            <TouchableOpacity
              style={[styles.actionButton, styles.respondButton]}
              onPress={() => onRespond(request)}
            >
              <Text style={[styles.actionButtonText, styles.respondButtonText]}>
                Respond
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  type: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
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
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  respondButton: {
    backgroundColor: '#2563EB',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  respondButtonText: {
    color: '#FFFFFF',
  },
});