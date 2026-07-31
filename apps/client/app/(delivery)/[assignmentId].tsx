import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DeliveryDetailScreen() {
  const { assignmentId } = useLocalSearchParams();
  const router = useRouter();

  // Mock assignment data
  const [assignment, setAssignment] = useState({
    id: assignmentId,
    status: 'ASSIGNED',
    order: {
      orderNumber: 'ORD-1234',
      customer: { phone: '+919876543210' },
      items: [
        { name: 'Margherita Pizza', quantity: 1 },
        { name: 'Coke', quantity: 2 }
      ]
    },
    customerAddress: {
      addressLine1: '123 Main St',
      city: 'Downtown',
      latitude: 18.5204,
      longitude: 73.8567,
    },
    branchAddress: {
      addressLine1: '456 Restaurant Lane',
      latitude: 18.5314,
      longitude: 73.8446,
    }
  });

  const openMaps = (lat: number, lng: number, label: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open maps'));
  };

  const callCustomer = () => {
    Linking.openURL(`tel:${assignment.order.customer.phone}`);
  };

  const updateStatus = (newStatus: string) => {
    // In a real app, call API to update status
    setAssignment({ ...assignment, status: newStatus });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Order #{assignment.order.orderNumber}</Text>
        <Text style={styles.status}>Status: {assignment.status}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Pickup</Text>
        <Text>{assignment.branchAddress.addressLine1}</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => openMaps(assignment.branchAddress.latitude, assignment.branchAddress.longitude, 'Restaurant')}
        >
          <Text style={styles.actionButtonText}>Navigate to Pickup</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dropoff</Text>
        <Text>{assignment.customerAddress.addressLine1}, {assignment.customerAddress.city}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.actionButton, { flex: 1, marginRight: 8 }]}
            onPress={() => openMaps(assignment.customerAddress.latitude, assignment.customerAddress.longitude, 'Customer')}
          >
            <Text style={styles.actionButtonText}>Navigate</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { flex: 1, backgroundColor: '#34C759' }]}
            onPress={callCustomer}
          >
            <Text style={styles.actionButtonText}>Call Customer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {assignment.order.items.map((item, idx) => (
          <Text key={idx} style={styles.itemText}>{item.quantity}x {item.name}</Text>
        ))}
      </View>

      <View style={styles.footer}>
        {assignment.status === 'ASSIGNED' && (
          <TouchableOpacity style={styles.primaryButton} onPress={() => updateStatus('PICKED_UP')}>
            <Text style={styles.primaryButtonText}>Mark as Picked Up</Text>
          </TouchableOpacity>
        )}
        {assignment.status === 'PICKED_UP' && (
          <TouchableOpacity style={styles.primaryButton} onPress={() => updateStatus('OUT_FOR_DELIVERY')}>
            <Text style={styles.primaryButtonText}>Start Delivery (En Route)</Text>
          </TouchableOpacity>
        )}
        {assignment.status === 'OUT_FOR_DELIVERY' && (
          <TouchableOpacity style={styles.primaryButton} onPress={() => updateStatus('DELIVERED')}>
            <Text style={styles.primaryButtonText}>Mark as Delivered</Text>
          </TouchableOpacity>
        )}
        {assignment.status === 'DELIVERED' && (
          <Text style={styles.completedText}>Delivery Completed</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 4,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#FF9500',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
  }
});
