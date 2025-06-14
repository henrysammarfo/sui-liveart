// Core NFT Types
export interface LiveArtNFT {
  id: string;
  name: string;
  description: string;
  image_url: string;
  creator: string;
  data_source: string;
  // Dynamic properties
  market_value: number;
  sentiment_score: number; // 1-10 scale
  volatility: 'low' | 'medium' | 'high';
  trend: 'bullish' | 'bearish' | 'neutral';
  last_updated: number;
  // Visual properties
  color_scheme: string;
  animation_speed: number;
  opacity: number;
  // Metadata
  owner?: string;
  created_at?: number;
  transformation_history?: NFTTransformation[];
  // Marketplace
  is_listed?: boolean;
  list_price?: number;
  tags?: string[];
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface NFTTransformation {
  timestamp: number;
  trigger: string;
  previous_state: Partial<LiveArtNFT>;
  new_state: Partial<LiveArtNFT>;
  data_point: DataPoint;
}

// Marketplace Types
export interface Listing {
  id: string;
  nft_id: string;
  nft: LiveArtNFT;
  seller: string;
  price: number;
  listed_at: number;
  status: 'active' | 'sold' | 'cancelled';
}

export interface MarketplaceStats {
  total_volume: number;
  total_sales: number;
  average_price: number;
  active_listings: number;
  fee_percentage: number;
}

// Data Feed Types
export interface DataFeed {
  id: string;
  name: string;
  description: string;
  provider: 'pyth' | 'oracle' | 'api';
  endpoint: string;
  update_frequency: number;
  is_active: boolean;
  last_updated: number;
  current_value?: number;
  price_feed_id?: string;
}

export interface DataPoint {
  feed_id: string;
  value: number;
  timestamp: number;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

// Creator Types
export interface NFTCreationData {
  name: string;
  description: string;
  image_url: string;
  data_source: string;
  initial_properties: {
    color_scheme: string;
    animation_speed: number;
    opacity: number;
  };
  triggers: TriggerCondition[];
}

export interface TriggerCondition {
  id: string;
  feed_id: string;
  operator: 'greater_than' | 'less_than' | 'equals' | 'percentage_change';
  threshold: number;
  property_to_change: keyof LiveArtNFT;
  new_value: unknown;
  is_active: boolean;
}

// Wallet Types
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  network: 'mainnet' | 'testnet' | 'devnet';
}

export interface TransactionResult {
  digest: string | undefined;
  effects: Record<string, unknown>;
  success: boolean;
  transaction_hash?: string;
  error?: string;
  gas_used?: number;
}

// UI State Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationState {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  is_read: boolean;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
}

// Constants
export const VOLATILITY_LEVELS = ['low', 'medium', 'high'] as const;
export const TREND_TYPES = ['bullish', 'bearish', 'neutral'] as const;
export const RARITY_LEVELS = ['common', 'rare', 'epic', 'legendary'] as const;