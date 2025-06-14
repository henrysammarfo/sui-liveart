import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import type { 
  LiveArtNFT, 
  Listing, 
  TransactionResult, 
  NFTCreationData
} from '../types';

// Configuration
export const NETWORKS = {
  mainnet: getFullnodeUrl('mainnet'),
  testnet: getFullnodeUrl('testnet'),
  devnet: getFullnodeUrl('devnet'),
} as const;

export const CONTRACT_CONFIG = {
  PACKAGE_ID: import.meta.env.VITE_PACKAGE_ID || '0x...',
  MODULE_NAME: 'dynamic_nft',
  RPC_URL: import.meta.env.VITE_RPC_URL || NETWORKS.testnet,
} as const;

export const GAS_BUDGET = {
  MINT: 10_000_000,
  LIST: 5_000_000,
  BUY: 15_000_000,
  TRANSFER: 3_000_000,
  UPDATE: 7_000_000,
} as const;

export class SuiService {
  private client: SuiClient;
  private network: keyof typeof NETWORKS;

  constructor(network: keyof typeof NETWORKS = 'testnet') {
    this.network = network;
    this.client = new SuiClient({ url: NETWORKS[network] });
  }

  getClient(): SuiClient {
    return this.client;
  }

  getNetwork(): string {
    return this.network;
  }

  // Utility Functions
  async getBalance(address: string): Promise<number> {
    try {
      const balance = await this.client.getBalance({ owner: address });
      return parseInt(balance.totalBalance) / 1_000_000_000; // Convert to SUI
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }

  async getObject(objectId: string) {
    try {
      const response = await this.client.getObject({
        id: objectId,
        options: {
          showContent: true,
          showOwner: true,
          showType: true,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching object:', error);
      return null;
    }
  }

  // NFT Functions
  async mintNFT(
    walletAddress: string,
    nftData: NFTCreationData,
    signAndExecute: (txb: Transaction) => Promise<TransactionResult>
  ): Promise<TransactionResult> {
    try {
      const txb = new Transaction();
      
      txb.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::mint_and_transfer`,
        arguments: [
          txb.pure.string(nftData.name),
          txb.pure.string(nftData.description),
          txb.pure.string(nftData.image_url),
          txb.pure.string(nftData.data_source),
          txb.pure.address(walletAddress),
          txb.object('0x6'), // Clock object
        ],
      });

      txb.setGasBudget(GAS_BUDGET.MINT);
      
      const result = await signAndExecute(txb);
      
      return {
        success: true,
        transaction_hash: result.digest,
        gas_used: this.extractGasUsed(result.effects),
        digest: result.digest,
        effects: result.effects,
      };
    } catch (error: unknown) {
      console.error('Error minting NFT:', error);
      return {
        success: false,
        error: this.extractErrorMessage(error),
        digest: undefined,
        effects: {},
      };
    }
  }

  async listNFT(
    nftId: string,
    price: number,
    marketplaceId: string,
    signAndExecute: (txb: Transaction) => Promise<TransactionResult>
  ): Promise<TransactionResult> {
    try {
      const txb = new Transaction();
      
      const priceInMist = Math.floor(price * 1_000_000_000); // Convert SUI to MIST
      
      txb.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::list_nft`,
        arguments: [
          txb.object(marketplaceId),
          txb.object(nftId),
          txb.pure.u64(priceInMist),
          txb.object('0x6'), // Clock object
        ],
      });

      txb.setGasBudget(GAS_BUDGET.LIST);
      
      const result = await signAndExecute(txb);
      
      return {
        success: true,
        transaction_hash: result.digest,
        gas_used: this.extractGasUsed(result.effects),
        digest: result.digest,
        effects: result.effects,
      };
    } catch (error: unknown) {
      console.error('Error listing NFT:', error);
      return {
        success: false,
        error: this.extractErrorMessage(error),
        digest: undefined,
        effects: {},
      };
    }
  }

  async buyNFT(
    nftId: string,
    marketplaceId: string,
    paymentCoinId: string,
    signAndExecute: (txb: Transaction) => Promise<TransactionResult>
  ): Promise<TransactionResult> {
    try {
      const txb = new Transaction();
      
      txb.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::buy_nft`,
        arguments: [
          txb.object(marketplaceId),
          txb.pure.address(nftId),
          txb.object(paymentCoinId),
        ],
      });

      txb.setGasBudget(GAS_BUDGET.BUY);
      
      const result = await signAndExecute(txb);
      
      return {
        success: true,
        transaction_hash: result.digest,
        gas_used: this.extractGasUsed(result.effects),
        digest: result.digest,
        effects: result.effects,
      };
    } catch (error: unknown) {
      console.error('Error buying NFT:', error);
      return {
        success: false,
        error: this.extractErrorMessage(error),
        digest: undefined,
        effects: {},
      };
    }
  }

  // Helper Methods
  private extractGasUsed(effects: Record<string, unknown>): number {
    if (
      effects &&
      typeof effects === 'object' &&
      'gasUsed' in effects &&
      effects.gasUsed &&
      typeof effects.gasUsed === 'object' &&
      effects.gasUsed !== null &&
      'computationCost' in effects.gasUsed
    ) {
      return (effects.gasUsed as { computationCost: number }).computationCost;
    }
    return 0;
  }

  private extractErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return (error as { message?: string }).message || 'Transaction failed';
    }
    return 'Transaction failed';
  }

  // Data Parsing
  parseNFTFromSuiObject(suiObject: unknown): LiveArtNFT | null {
    try {
      // Implementation for parsing Sui object to NFT
      // This would need to be implemented based on your contract structure
      console.log('Parsing NFT from Sui object:', suiObject);
      return null;
    } catch (error) {
      console.error('Error parsing NFT from Sui object:', error);
      return null;
    }
  }

  // Utility functions
  formatSuiAmount(amount: number): string {
    return (amount / 1_000_000_000).toFixed(4);
  }

  validateAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{64}$/.test(address);
  }

  shortenAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}

// Export default instance
export const suiService = new SuiService();
export default suiService;