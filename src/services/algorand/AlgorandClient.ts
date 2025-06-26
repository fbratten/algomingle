/**
 * Algorand Client Configuration
 * Manages connection to Algorand network
 */

import algosdk from 'algorand-js-sdk';

export type NetworkType = 'mainnet' | 'testnet' | 'local';

interface NetworkConfig {
  algodServer: string;
  algodPort: number;
  algodToken: string;
  indexerServer?: string;
  indexerPort?: number;
  indexerToken?: string;
}

const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
  mainnet: {
    algodServer: 'https://mainnet-api.algonode.cloud',
    algodPort: 443,
    algodToken: '',
    indexerServer: 'https://mainnet-idx.algonode.cloud',
    indexerPort: 443,
    indexerToken: ''
  },
  testnet: {
    algodServer: 'https://testnet-api.algonode.cloud',
    algodPort: 443,
    algodToken: '',
    indexerServer: 'https://testnet-idx.algonode.cloud',
    indexerPort: 443,
    indexerToken: ''
  },
  local: {
    algodServer: 'http://localhost',
    algodPort: 4001,
    algodToken: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    indexerServer: 'http://localhost',
    indexerPort: 8980,
    indexerToken: ''
  }
};

class AlgorandClient {
  private static instance: AlgorandClient;
  private algodClient: algosdk.Algodv2 | null = null;
  private indexerClient: algosdk.Indexer | null = null;
  private currentNetwork: NetworkType = 'testnet';

  private constructor() {}

  static getInstance(): AlgorandClient {
    if (!AlgorandClient.instance) {
      AlgorandClient.instance = new AlgorandClient();
    }
    return AlgorandClient.instance;
  }

  /**
   * Initialize Algorand clients
   */
  initialize(network: NetworkType = 'testnet'): void {
    this.currentNetwork = network;
    const config = NETWORK_CONFIGS[network];

    // Initialize Algod client
    this.algodClient = new algosdk.Algodv2(
      config.algodToken,
      config.algodServer,
      config.algodPort
    );

    // Initialize Indexer client if available
    if (config.indexerServer) {
      this.indexerClient = new algosdk.Indexer(
        config.indexerToken || '',
        config.indexerServer,
        config.indexerPort
      );
    }
  }

  /**
   * Get Algod client
   */
  getAlgodClient(): algosdk.Algodv2 {
    if (!this.algodClient) {
      this.initialize();
    }
    return this.algodClient!;
  }

  /**
   * Get Indexer client
   */
  getIndexerClient(): algosdk.Indexer | null {
    return this.indexerClient;
  }

  /**
   * Get current network
   */
  getCurrentNetwork(): NetworkType {
    return this.currentNetwork;
  }

  /**
   * Get account balance
   */
  async getAccountBalance(address: string): Promise<number> {
    try {
      const accountInfo = await this.getAlgodClient()
        .accountInformation(address)
        .do();
      return accountInfo.amount / 1e6; // Convert microAlgos to Algos
    } catch (error) {
      console.error('Failed to get account balance:', error);
      return 0;
    }
  }

  /**
   * Check if account is opted into an asset
   */
  async isOptedIntoAsset(address: string, assetId: number): Promise<boolean> {
    try {
      const accountInfo = await this.getAlgodClient()
        .accountInformation(address)
        .do();
      
      return accountInfo.assets?.some((asset: any) => asset['asset-id'] === assetId) || false;
    } catch {
      return false;
    }
  }

  /**
   * Get suggested transaction parameters
   */
  async getTransactionParams(): Promise<algosdk.SuggestedParams> {
    return await this.getAlgodClient().getTransactionParams().do();
  }

  /**
   * Send signed transaction
   */
  async sendTransaction(signedTxn: Uint8Array): Promise<string> {
    const { txId } = await this.getAlgodClient()
      .sendRawTransaction(signedTxn)
      .do();
    
    return txId;
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForConfirmation(txId: string, timeout: number = 10): Promise<algosdk.modelsv2.PendingTransactionResponse> {
    return await algosdk.waitForConfirmation(
      this.getAlgodClient(),
      txId,
      timeout
    );
  }
}

export default AlgorandClient.getInstance();
