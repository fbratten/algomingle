/**
 * Algorand Wallet Service
 * Handles wallet creation, import, and management
 */

import algosdk from 'algorand-js-sdk';
import * as Keychain from 'react-native-keychain';
import EncryptedStorage from 'react-native-encrypted-storage';

export interface WalletAccount {
  address: string;
  name?: string;
  createdAt: Date;
}

export interface SecureWalletData {
  mnemonic: string;
  accounts: WalletAccount[];
  activeAccountIndex: number;
}

class WalletService {
  private static instance: WalletService;
  private currentAccount: algosdk.Account | null = null;

  private constructor() {}

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  /**
   * Generate a new wallet with mnemonic
   */
  async createNewWallet(): Promise<{ mnemonic: string; address: string }> {
    try {
      const account = algosdk.generateAccount();
      const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
      
      // Store wallet data securely
      const walletData: SecureWalletData = {
        mnemonic,
        accounts: [{
          address: account.addr,
          name: 'Main Account',
          createdAt: new Date()
        }],
        activeAccountIndex: 0
      };

      await this.saveWalletData(walletData);
      this.currentAccount = account;

      return {
        mnemonic,
        address: account.addr
      };
    } catch (error) {
      throw new Error(`Failed to create wallet: ${error}`);
    }
  }

  /**
   * Import existing wallet from mnemonic
   */
  async importWallet(mnemonic: string): Promise<string> {
    try {
      const account = algosdk.mnemonicToSecretKey(mnemonic);
      
      const walletData: SecureWalletData = {
        mnemonic,
        accounts: [{
          address: account.addr,
          name: 'Imported Account',
          createdAt: new Date()
        }],
        activeAccountIndex: 0
      };

      await this.saveWalletData(walletData);
      this.currentAccount = account;

      return account.addr;
    } catch (error) {
      throw new Error(`Failed to import wallet: ${error}`);
    }
  }

  /**
   * Check if wallet exists
   */
  async hasWallet(): Promise<boolean> {
    try {
      const walletData = await EncryptedStorage.getItem('algomingle_wallet');
      return walletData !== null;
    } catch {
      return false;
    }
  }

  /**
   * Load wallet from secure storage
   */
  async loadWallet(): Promise<WalletAccount | null> {
    try {
      const walletDataStr = await EncryptedStorage.getItem('algomingle_wallet');
      if (!walletDataStr) return null;

      const walletData: SecureWalletData = JSON.parse(walletDataStr);
      const account = algosdk.mnemonicToSecretKey(walletData.mnemonic);
      this.currentAccount = account;

      return walletData.accounts[walletData.activeAccountIndex];
    } catch (error) {
      console.error('Failed to load wallet:', error);
      return null;
    }
  }

  /**
   * Get current account address
   */
  getCurrentAddress(): string | null {
    return this.currentAccount?.addr || null;
  }

  /**
   * Sign transaction
   */
  async signTransaction(txn: algosdk.Transaction): Promise<Uint8Array> {
    if (!this.currentAccount) {
      throw new Error('No wallet loaded');
    }

    return txn.signTxn(this.currentAccount.sk);
  }

  /**
   * Save wallet data securely
   */
  private async saveWalletData(data: SecureWalletData): Promise<void> {
    await EncryptedStorage.setItem(
      'algomingle_wallet',
      JSON.stringify(data)
    );

    // Store address in keychain for quick access
    await Keychain.setInternetCredentials(
      'algomingle.algorand',
      data.accounts[data.activeAccountIndex].address,
      'wallet'
    );
  }

  /**
   * Delete wallet (use with caution!)
   */
  async deleteWallet(): Promise<void> {
    await EncryptedStorage.removeItem('algomingle_wallet');
    await Keychain.resetInternetCredentials('algomingle.algorand');
    this.currentAccount = null;
  }
}

export default WalletService.getInstance();
