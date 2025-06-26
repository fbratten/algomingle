import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import WalletService from '../services/algorand/WalletService';
import AlgorandClient from '../services/algorand/AlgorandClient';

const MainScreen = ({ navigation }: any) => {
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    loadWalletInfo();
  }, []);

  const loadWalletInfo = async () => {
    const currentAddress = WalletService.getCurrentAddress();
    if (currentAddress) {
      setAddress(currentAddress);
      const accountBalance = await AlgorandClient.getAccountBalance(currentAddress);
      setBalance(accountBalance);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AlgoMingle</Text>
        <Text style={styles.subtitle}>Phase 1: Wallet Integration</Text>
      </View>

      <View style={styles.walletCard}>
        <Text style={styles.cardTitle}>Your Wallet</Text>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.address}>{address}</Text>
        <Text style={styles.label}>Balance:</Text>
        <Text style={styles.balance}>{balance} ALGO</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Coming Soon</Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>✉️ Encrypted Messaging</Text>
          <Text style={styles.featureItem}>👥 Group Chats</Text>
          <Text style={styles.featureItem}>🔐 Signal Protocol Integration</Text>
          <Text style={styles.featureItem}>📱 Contact Management</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => {/* TODO: Navigate to settings */}}
      >
        <Text style={styles.settingsButtonText}>Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  walletCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  address: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
    marginTop: 5,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  featureList: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  featureItem: {
    fontSize: 16,
    marginVertical: 8,
    color: '#333',
  },
  settingsButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MainScreen;
