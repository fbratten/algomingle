import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import WalletService from './src/services/algorand/WalletService';
import AlgorandClient from './src/services/algorand/AlgorandClient';
import WalletSetupScreen from './src/screens/WalletSetupScreen';
import MainScreen from './src/screens/MainScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize Algorand client
      AlgorandClient.initialize('testnet');
      
      // Check if user has wallet
      const walletExists = await WalletService.hasWallet();
      setHasWallet(walletExists);
      
      if (walletExists) {
        await WalletService.loadWallet();
      }
    } catch (error) {
      console.error('App initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={hasWallet ? 'Main' : 'WalletSetup'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="WalletSetup" 
          component={WalletSetupScreen}
          options={{ title: 'Setup Wallet' }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainScreen}
          options={{ title: 'AlgoMingle' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
