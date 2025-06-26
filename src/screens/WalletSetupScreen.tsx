import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import WalletService from '../services/algorand/WalletService';

type SetupMode = 'none' | 'create' | 'import';

const WalletSetupScreen = ({ navigation }: any) => {
  const [mode, setMode] = useState<SetupMode>('none');
  const [loading, setLoading] = useState(false);
  const [mnemonic, setMnemonic] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');

  const handleCreateWallet = async () => {
    setLoading(true);
    try {
      const { mnemonic, address } = await WalletService.createNewWallet();
      setMnemonic(mnemonic);
      setWalletAddress(address);
      setMode('create');
    } catch (error) {
      Alert.alert('Error', 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', `${label} copied to clipboard`);
  };

  const handleContinue = () => {
    navigation.replace('Main');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (mode === 'create' && mnemonic) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Your New Wallet</Text>
          
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ Important</Text>
            <Text style={styles.warningText}>
              Save your recovery phrase in a safe place. You'll need it to recover your wallet.
              Never share it with anyone!
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wallet Address</Text>
            <TouchableOpacity
              style={styles.copyBox}
              onPress={() => copyToClipboard(walletAddress, 'Address')}
            >
              <Text style={styles.addressText}>{walletAddress}</Text>
              <Text style={styles.copyHint}>Tap to copy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recovery Phrase</Text>
            <TouchableOpacity
              style={styles.mnemonicBox}
              onPress={() => copyToClipboard(mnemonic, 'Recovery phrase')}
            >
              <Text style={styles.mnemonicText}>{mnemonic}</Text>
              <Text style={styles.copyHint}>Tap to copy</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>I've Saved My Recovery Phrase</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to AlgoMingle</Text>
        <Text style={styles.subtitle}>
          Secure messaging powered by Algorand blockchain
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateWallet}
          >
            <Text style={styles.buttonText}>Create New Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('ImportWallet')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Import Existing Wallet
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    marginTop: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  copyBox: {
    backgroundColor: '#E8F4FF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#333',
  },
  mnemonicBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  mnemonicText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  copyHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default WalletSetupScreen;
