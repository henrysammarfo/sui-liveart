// =================== Core NFT Types ===================

export interface LiveArtNFT {
  id: string;
  name: string;
  description: string;
  image_url: string;
  creator: string;
  data_source: string;
  // Dynamic properties that change with real-world data
  market_value: number;
  sentiment_score: number; // 1-10 scale
  volatility: 'low' | 'medium' | 'high';
  trend: 'bullish' | 'bearish' | 'neutral';
  last_updated: number;
  // Visual properties that change
  color_scheme: string;
  animation_speed: number;
  opacity: number;
  // Additional metadata
  owner?: string;
  created_at?: number;
  transformation_history?: NFTTransformation[];
  // Marketplace properties ✅ Fixed type
  is_listed?: boolean;
  list_price?: number; // Changed to number
}

export interface NFTTransformation {
  timestamp: number;
  trigger: string;
  previous_state: Partial<LiveArtNFT>;
  new_state: Partial<LiveArtNFT>;
  data_point: DataPoint;
}

// =================== Marketplace Types ===================

export interface Listing {
  id: string;
  nft_id: string;
  nft: LiveArtNFT;
  seller: string;
  price: number; // in SUI
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

// =================== Data Feed Types ===================

export interface DataFeed {
  id: string;
  name: string;
  description: string;
  provider: 'pyth' | 'oracle' | 'api';
  endpoint: string;
  update_frequency: number; // in seconds
  is_active: boolean;
  last_updated: number;
  current_value?: number;
  price_feed_id?: string; // For Pyth feeds
}

export interface DataPoint {
  feed_id: string;
  value: number;
  timestamp: number;
  confidence?: number;
  metadata?: Record<string, unknown>;
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

// =================== Creator Studio Types ===================

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

export interface CreatorProfile {
  address: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  created_nfts: string[];
  total_sales: number;
  total_volume: number;
}

// =================== Wallet & Transaction Types ===================

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

export interface SuiObjectRef {
  objectId: string;
  version: string;
  digest: string;
}

// =================== UI State Types ===================

export interface NFTFilters {
  price_range: {
    min: number;
    max: number;
  };
  sentiment_range: {
    min: number;
    max: number;
  };
  volatility: ('low' | 'medium' | 'high')[];
  trend: ('bullish' | 'bearish' | 'neutral')[];
  creator?: string;
  data_source?: string;
  sort_by: 'price' | 'sentiment' | 'created_at' | 'last_updated';
  sort_order: 'asc' | 'desc';
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  is_read: boolean;
}

// =================== Kiosk Types ===================

export interface KioskData {
  id: string;
  owner: string;
  nfts: LiveArtNFT[];
  settings: {
    is_public: boolean;
    allow_transfers: boolean;
    royalty_percentage: number;
  };
  created_at: number;
}

export interface KioskPermissions {
  can_list: boolean;
  can_transfer: boolean;
  can_modify: boolean;
}

// =================== Analytics Types ===================

export interface NFTAnalytics {
  nft_id: string;
  price_history: Array<{
    timestamp: number;
    price: number;
  }>;
  sentiment_history: Array<{
    timestamp: number;
    sentiment: number;
  }>;
  view_count: number;
  favorite_count: number;
  transformation_count: number;
}

export interface MarketAnalytics {
  daily_volume: number;
  daily_sales: number;
  top_performers: LiveArtNFT[];
  trending_creators: CreatorProfile[];
  price_trends: Record<string, number>;
}

// =================== API Response Types ===================

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

// =================== Component Props Types ===================

export interface NFTCardProps {
  nft: LiveArtNFT;
  showPrice?: boolean;
  showActions?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: (nft: LiveArtNFT) => void;
}

export interface DataFeedCardProps {
  feed: DataFeed;
  current_data?: DataPoint;
  onToggle?: (feedId: string) => void;
}

export interface TriggerBuilderProps {
  triggers: TriggerCondition[];
  available_feeds: DataFeed[];
  onChange: (triggers: TriggerCondition[]) => void;
}

// =================== Form Types ===================

export interface CreateNFTForm {
  name: string;
  description: string;
  image_url: string;
  data_source: string;
  color_scheme: string;
  animation_speed: number;
  opacity: number;
}

export interface ListNFTForm {
  nft_id: string;
  price: number;
  duration?: number; // in days
}

// =================== Utility Types ===================

export type SortDirection = 'asc' | 'desc';
export type NetworkType = 'mainnet' | 'testnet' | 'devnet';
export type TransactionStatus = 'pending' | 'success' | 'failed';

// =================== Error Types ===================

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class NFTError extends Error {
  code: string;
  details?: Record<string, unknown>;

  constructor(code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'NFTError';
  }
}

// =================== Constants ===================

export const VOLATILITY_LEVELS = ['low', 'medium', 'high'] as const;
export const TREND_TYPES = ['bullish', 'bearish', 'neutral'] as const;
export const OPERATOR_TYPES = ['greater_than', 'less_than', 'equals', 'percentage_change'] as const;
export const SORT_OPTIONS = ['price', 'sentiment', 'created_at', 'last_updated'] as const;

// =================== Enums ===================

export const TransactionType = {
  MINT: 'mint',
  LIST: 'list',
  BUY: 'buy',
  TRANSFER: 'transfer',
  UPDATE: 'update',
  DELIST: 'delist'
} as const;
export type TransactionType = typeof TransactionType[keyof typeof TransactionType];
export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const;
export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const LoadingState = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;
export type LoadingState = typeof LoadingState[keyof typeof LoadingState];