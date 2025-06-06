import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import type { 
  LiveArtNFT, 
  Listing, 
  TransactionResult, 
  NFTCreationData
} from '../types';
import { TransactionType } from '../types';

// =================== Constants ===================

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

// =================== Client Setup ===================

// Define a type for the expected Sui object structure
interface SuiObjectFields {
  seller: string;
  price: string;
  listed_at: string;
  name?: string;
  description?: string;
  image_url?: { fields?: { url?: string } } | string;
  creator?: string;
  data_source?: string;
  market_value?: string;
  sentiment_score?: string;
  volatility?: 'low' | 'medium' | 'high';
  trend?: 'bullish' | 'bearish' | 'neutral';
  last_updated?: string;
  color_scheme?: string;
  animation_speed?: string;
  opacity?: string;
}

interface SuiObjectContent {
  fields: SuiObjectFields;
}

interface SuiObjectData {
  objectId: string;
  content: SuiObjectContent;
  owner?: { AddressOwner?: string };
}

interface SuiObjectTyped {
  data?: SuiObjectData | null;
}

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

  // =================== Utility Functions ===================

  async getBalance(address: string): Promise<number> {
    try {
      const balance = await this.client.getBalance({ owner: address });
      return parseInt(balance.totalBalance) / 1_000_000_000; // Convert to SUI
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }

  async getObject(objectId: string): Promise<import('@mysten/sui/client').SuiObjectResponse | null> {
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

  async getOwnedObjects(address: string, type?: string): Promise<import('@mysten/sui/client').SuiObjectResponse[]> {
    try {
      const response = await this.client.getOwnedObjects({
        owner: address,
        filter: type ? { StructType: type } : undefined,
        options: {
          showContent: true,
          showType: true,
        },
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching owned objects:', error);
      return [];
    }
  }

  // =================== NFT Functions ===================

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
        gas_used: (result.effects?.gasUsed && typeof result.effects.gasUsed === 'object' && result.effects.gasUsed !== null && 'computationCost' in result.effects.gasUsed
          ? (result.effects.gasUsed as { computationCost: number }).computationCost
          : 0),
        digest: result.digest,
        effects: result.effects,
      };
    } catch (error: unknown) {
      console.error('Error minting NFT:', error);
      return {
        success: false,
        error: typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'Failed to mint NFT'
          : 'Failed to mint NFT',
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
        gas_used: (result.effects?.gasUsed && typeof result.effects.gasUsed === 'object' && result.effects.gasUsed !== null && 'computationCost' in result.effects.gasUsed
          ? (result.effects.gasUsed as { computationCost: number }).computationCost
          : 0),
        digest: result.digest,
        effects: result.effects,
      };
    } catch (error: unknown) {
      console.error('Error listing NFT:', error);
      return {
        success: false,
        error: typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'Failed to list NFT'
          : 'Failed to list NFT',
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
        gas_used: (result.effects?.gasUsed && typeof result.effects.gasUsed === 'object' && result.effects.gasUsed !== null && 'computationCost' in result.effects.gasUsed
          ? (result.effects.gasUsed as { computationCost: number }).computationCost
          : 0),
        digest: result.digest,
        effects: result.effects,
      };
    } catch (error: unknown) {
      console.error('Error buying NFT:', error);
      return {
        success: false,
        error: typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'Failed to buy NFT'
          : 'Failed to buy NFT',
        digest: undefined,
        effects: {},
      };
    }
  }

  async delistNFT(
    nftId: string,
    marketplaceId: string,
    signAndExecute: (txb: Transaction) => Promise<TransactionResult>
  ): Promise<TransactionResult> {
    try {
      const txb = new Transaction();

      txb.moveCall({
        target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::delist_nft`,
        arguments: [
          txb.object(marketplaceId),
          txb.object(nftId),
          txb.object('0x6'), // Clock object
        ],
      });

      txb.setGasBudget(GAS_BUDGET.LIST);

      const result = await signAndExecute(txb);

      return {
        success: true,
        transaction_hash: result.digest,
        gas_used: (result.effects?.gasUsed && typeof result.effects.gasUsed === 'object' && result.effects.gasUsed !== null && 'computationCost' in result.effects.gasUsed
          ? (result.effects.gasUsed as { computationCost: number }).computationCost
          : 0),
        digest: result.digest,
        effects: result.effects,
      };
    } catch (error: unknown) {
      console.error('Error delisting NFT:', error);
      return {
        success: false,
        error: typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'Failed to delist NFT'
          : 'Failed to delist NFT',
        digest: undefined,
        effects: {},
      };
    }
  }
  // =================== Data Parsing Functions ===================

  parseNFTFromSuiObject(suiObject: unknown): LiveArtNFT | null {
    try {
      interface SuiObjectFields {
        name?: string;
        description?: string;
        image_url?: { fields?: { url?: string } } | string;
        creator?: string;
        data_source?: string;
        market_value?: string;
        sentiment_score?: string;
        volatility?: 'low' | 'medium' | 'high';
        trend?: 'bullish' | 'bearish' | 'neutral';
        last_updated?: string;
        color_scheme?: string;
        animation_speed?: string;
        opacity?: string;
      }

      interface SuiObjectContent {
        fields: SuiObjectFields;
      }

      interface SuiObjectData {
        objectId: string;
        content: SuiObjectContent;
        owner?: { AddressOwner?: string };
      }

      interface SuiObjectTyped {
        data?: SuiObjectData | null;
      }

      if (
        typeof suiObject !== 'object' ||
        suiObject === null ||
        !('data' in suiObject) ||
        typeof (suiObject as SuiObjectTyped).data !== 'object' ||
        (suiObject as SuiObjectTyped).data === null ||
        !('content' in (suiObject as SuiObjectTyped).data!) ||
        typeof (suiObject as SuiObjectTyped).data!.content !== 'object' ||
        (suiObject as SuiObjectTyped).data!.content === null ||
        !('fields' in (suiObject as SuiObjectTyped).data!.content)
      ) {
        return null;
      }

      const fields = (suiObject as SuiObjectTyped).data!.content.fields;
      
      return {
        id: (suiObject as SuiObjectTyped).data!.objectId,
        name: fields.name || '',
        description: fields.description || '',
        image_url: typeof fields.image_url === 'object' && fields.image_url !== null
          ? fields.image_url.fields?.url || ''
          : (fields.image_url as string) || '',
        creator: fields.creator || '',
        data_source: fields.data_source || '',
        market_value: parseInt(fields.market_value || '0'),
        sentiment_score: parseInt(fields.sentiment_score || '5'),
        volatility: fields.volatility || 'medium',
        trend: fields.trend || 'neutral',
        last_updated: parseInt(fields.last_updated || '0'),
        color_scheme: fields.color_scheme || 'blue',
        animation_speed: parseInt(fields.animation_speed || '1'),
        opacity: parseInt(fields.opacity || '100'),
        owner: (suiObject as SuiObjectTyped).data!.owner?.AddressOwner || '',
        created_at: parseInt(fields.last_updated || '0'),
      };
    } catch (error) {
      console.error('Error parsing NFT from Sui object:', error);
      return null;
    }
  }

  parseListingFromSuiObject(suiObject: unknown, nft: LiveArtNFT): Listing | null {
    try {
      if (
        typeof suiObject !== 'object' ||
        suiObject === null ||
        !('data' in suiObject) ||
        typeof (suiObject as SuiObjectTyped).data !== 'object' ||
        (suiObject as SuiObjectTyped).data === null ||
        !('content' in (suiObject as SuiObjectTyped).data!) ||
        typeof (suiObject as SuiObjectTyped).data!.content !== 'object' ||
        (suiObject as SuiObjectTyped).data!.content === null ||
        !('fields' in (suiObject as SuiObjectTyped).data!.content)
      ) {
        return null;
      }

      const fields = (suiObject as SuiObjectTyped).data!.content.fields;
      
      const data = (suiObject as SuiObjectTyped).data;
      const objectId =
        data &&
        typeof data === 'object' &&
        'objectId' in data
          ? (data as SuiObjectData).objectId
          : '';

      return {
        id: objectId,
        nft_id: nft.id,
        nft,
        seller: fields.seller || '',
        price: parseInt(fields.price || '0') / 1_000_000_000, // Convert from MIST to SUI
        listed_at: parseInt(fields.listed_at || '0'),
        status: 'active',
      };
    } catch (error) {
      console.error('Error parsing listing from Sui object:', error);
      return null;
    }
  }

  // =================== Event Parsing ===================

  parseTransactionEvents(transaction: unknown): Array<{
    type: TransactionType;
    data: unknown;
  }> {
    const events: Array<{ type: TransactionType; data: unknown }> = [];
    
    try {
      if (
        typeof transaction === 'object' &&
        transaction !== null &&
        'events' in transaction &&
        Array.isArray((transaction as { events: unknown }).events)
      ) {
        for (const event of (transaction as { events: unknown[] }).events) {
          if (
            typeof event === 'object' &&
            event !== null &&
            'type' in event &&
            typeof (event as { type: unknown }).type === 'string'
          ) {
            const eventType = (event as { type: string }).type;
            if (eventType.includes('NFTMinted')) {
              events.push({
                type: TransactionType.MINT,
                data: (event as { parsedJson?: unknown }).parsedJson,
              });
            } else if (eventType.includes('NFTListed')) {
              events.push({
                type: TransactionType.LIST,
                data: (event as { parsedJson?: unknown }).parsedJson,
              });
            } else if (eventType.includes('NFTSold')) {
              events.push({
                type: TransactionType.BUY,
                data: (event as { parsedJson?: unknown }).parsedJson,
              });
            } else if (eventType.includes('NFTUpdated')) {
              events.push({
                type: TransactionType.UPDATE,
                data: (event as { parsedJson?: unknown }).parsedJson,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error parsing transaction events:', error);
    }
    
    return events;
  }

  // =================== Query Functions ===================

  async getUserNFTs(address: string): Promise<LiveArtNFT[]> {
    try {
      const nftType = `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::LiveArtNFT`;
      const objects = await this.getOwnedObjects(address, nftType);
      
      return objects
        .map(obj => this.parseNFTFromSuiObject(obj))
        .filter((nft): nft is LiveArtNFT => nft !== null);
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      return [];
    }
  }

  async getAllNFTs(): Promise<LiveArtNFT[]> {
    try {
      // This would require indexing service in production
      // For now, return empty array - implement with Sui indexer API
      console.warn('getAllNFTs requires indexing service - implement with Sui GraphQL');
      return [];
    } catch (error) {
      console.error('Error fetching all NFTs:', error);
      return [];
    }
  }

  async getMarketplaceListings(): Promise<Listing[]> {
    try {
      // This would require querying marketplace object
      // For now, return empty array - implement with proper marketplace queries
      console.warn('getMarketplaceListings requires marketplace object query');
      return [];
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
      return [];
    }
  }

  // =================== Helper Functions ===================

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

  async waitForTransaction(
    digest: string,
    maxWaitTime: number = 30000
  ): Promise<import('@mysten/sui/client').SuiTransactionBlockResponse> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const result = await this.client.getTransactionBlock({
          digest,
          options: {
            showEffects: true,
            showEvents: true,
          },
        });
        
        if (result.effects?.status?.status === 'success') {
          return result;
        } else if (result.effects?.status?.status === 'failure') {
          throw new Error('Transaction failed');
        }
      } catch {
        // Transaction might not be available yet, continue waiting
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Transaction timeout');
  }
}

// =================== Export Default Instance ===================

export const suiService = new SuiService();

// =================== Utility Functions ===================

export const formatPrice = (price: number): string => {
  if (price < 1) {
    return price.toFixed(4);
  } else if (price < 1000) {
    return price.toFixed(2);
  } else if (price < 1000000) {
    return `${(price / 1000).toFixed(1)}K`;
  } else {
    return `${(price / 1000000).toFixed(1)}M`;
  }
};

export const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return 'Just now';
  }
};

export const getTrendColor = (trend: string): string => {
  switch (trend) {
    case 'bullish':
      return 'text-green-400';
    case 'bearish':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

export const getVolatilityColor = (volatility: string): string => {
  switch (volatility) {
    case 'high':
      return 'text-red-400';
    case 'medium':
      return 'text-yellow-400';
    case 'low':
      return 'text-green-400';
    default:
      return 'text-gray-400';
  }
};