import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { suiService } from '../components/utils/suiUtils';
// Update the import path below if your types are located elsewhere, e.g. './types' or './types/index'
import type { 
  LiveArtNFT, 
  Listing, 
  WalletState, 
  TransactionResult, 
  NFTCreationData,
  DataFeed,
  MarketplaceStats,
  LoadingState,
  NotificationState,
  NotificationType
} from '../components/types/index';
import type { Transaction } from '@mysten/sui/transactions';

// =================== State Types ===================

interface NftState {
  // Wallet state
  wallet: WalletState;
  
  // NFT data
  userNfts: LiveArtNFT[];
  allNfts: LiveArtNFT[];
  selectedNft: LiveArtNFT | null;
  
  // Marketplace data
  listings: Listing[];
  marketplaceStats: MarketplaceStats;
  
  // Data feeds
  dataFeeds: DataFeed[];
  activeFeeds: DataFeed[];
  
  // UI state
  loadingStates: Record<string, LoadingState>;
  notifications: NotificationState[];
  
  // Cache
  lastFetchTime: Record<string, number>;
}

// =================== Action Types ===================

type NftAction =
  | { type: 'SET_WALLET_STATE'; payload: WalletState }
  | { type: 'SET_USER_NFTS'; payload: LiveArtNFT[] }
  | { type: 'SET_ALL_NFTS'; payload: LiveArtNFT[] }
  | { type: 'SET_SELECTED_NFT'; payload: LiveArtNFT | null }
  | { type: 'SET_LISTINGS'; payload: Listing[] }
  | { type: 'SET_MARKETPLACE_STATS'; payload: MarketplaceStats }
  | { type: 'SET_DATA_FEEDS'; payload: DataFeed[] }
  | { type: 'SET_ACTIVE_FEEDS'; payload: DataFeed[] }
  | { type: 'SET_LOADING_STATE'; payload: { key: string; state: LoadingState } }
  | { type: 'ADD_NOTIFICATION'; payload: NotificationState }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_NFT'; payload: LiveArtNFT }
  | { type: 'ADD_NFT'; payload: LiveArtNFT }
  | { type: 'REMOVE_NFT'; payload: string }
  | { type: 'UPDATE_LISTING'; payload: Listing }
  | { type: 'REMOVE_LISTING'; payload: string }
  | { type: 'SET_LAST_FETCH_TIME'; payload: { key: string; time: number } }
  | { type: 'RESET_STATE' };

// =================== Initial State ===================

const initialState: NftState = {
  wallet: {
    isConnected: false,
    address: null,
    balance: 0,
    network: 'testnet',
  },
  userNfts: [],
  allNfts: [],
  selectedNft: null,
  listings: [],
  marketplaceStats: {
    total_volume: 0,
    total_sales: 0,
    average_price: 0,
    active_listings: 0,
    fee_percentage: 2.5,
  },
  dataFeeds: [],
  activeFeeds: [],
  loadingStates: {},
  notifications: [],
  lastFetchTime: {},
};

// =================== Reducer ===================

function nftReducer(state: NftState, action: NftAction): NftState {
  switch (action.type) {
    case 'SET_WALLET_STATE':
      return { ...state, wallet: action.payload };
    
    case 'SET_USER_NFTS':
      return { ...state, userNfts: action.payload };
    
    case 'SET_ALL_NFTS':
      return { ...state, allNfts: action.payload };
    
    case 'SET_SELECTED_NFT':
      return { ...state, selectedNft: action.payload };
    
    case 'SET_LISTINGS':
      return { ...state, listings: action.payload };
    
    case 'SET_MARKETPLACE_STATS':
      return { ...state, marketplaceStats: action.payload };
    
    case 'SET_DATA_FEEDS':
      return { ...state, dataFeeds: action.payload };
    
    case 'SET_ACTIVE_FEEDS':
      return { ...state, activeFeeds: action.payload };
    
    case 'SET_LOADING_STATE':
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          [action.payload.key]: action.payload.state,
        },
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    case 'UPDATE_NFT':
      return {
        ...state,
        userNfts: state.userNfts.map(nft => 
          nft.id === action.payload.id ? action.payload : nft
        ),
        allNfts: state.allNfts.map(nft => 
          nft.id === action.payload.id ? action.payload : nft
        ),
        selectedNft: state.selectedNft?.id === action.payload.id ? action.payload : state.selectedNft,
      };
    
    case 'ADD_NFT':
      return {
        ...state,
        userNfts: [...state.userNfts, action.payload],
        allNfts: [...state.allNfts, action.payload],
      };
    
    case 'REMOVE_NFT':
      return {
        ...state,
        userNfts: state.userNfts.filter(nft => nft.id !== action.payload),
        allNfts: state.allNfts.filter(nft => nft.id !== action.payload),
        selectedNft: state.selectedNft?.id === action.payload ? null : state.selectedNft,
      };
    
    case 'UPDATE_LISTING':
      return {
        ...state,
        listings: state.listings.map(listing => 
          listing.id === action.payload.id ? action.payload : listing
        ),
      };
    
    case 'REMOVE_LISTING':
      return {
        ...state,
        listings: state.listings.filter(listing => listing.id !== action.payload),
      };
    
    case 'SET_LAST_FETCH_TIME':
      return {
        ...state,
        lastFetchTime: {
          ...state.lastFetchTime,
          [action.payload.key]: action.payload.time,
        },
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// =================== Context Type ===================

interface NftContextType {
  // State
  state: NftState;
  
  // Wallet functions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
  
  // NFT functions
  mintNft: (nftData: NFTCreationData) => Promise<TransactionResult>;
  fetchUserNfts: () => Promise<void>;
  fetchAllNfts: () => Promise<void>;
  selectNft: (nft: LiveArtNFT | null) => void;
  
  // Marketplace functions
  listNft: (nftId: string, price: number) => Promise<TransactionResult>;
  buyNft: (nftId: string) => Promise<TransactionResult>;
  delistNft: (nftId: string) => Promise<TransactionResult>;
  fetchListings: () => Promise<void>;
  fetchMarketplaceStats: () => Promise<void>;
  
  // Data feed functions
  fetchDataFeeds: () => Promise<void>;
  toggleDataFeed: (feedId: string) => void;
  
  // Utility functions
  showNotification: (type: NotificationType, title: string, message: string) => void;
  hideNotification: (id: string) => void;
  setLoading: (key: string, state: LoadingState) => void;
  isLoading: (key: string) => boolean;
  
  // Cache functions
  shouldRefetch: (key: string, maxAge?: number) => boolean;
}

// =================== Context Creation ===================

const NftContext = createContext<NftContextType | undefined>(undefined);

// =================== Provider Component ===================

interface NftProviderProps {
  children: React.ReactNode;
}

export function NftProvider({ children }: NftProviderProps) {
  const [state, dispatch] = useReducer(nftReducer, initialState);
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransactionRaw } = useSignAndExecuteTransaction();

  // Adapter to match (txb: Transaction) => Promise<TransactionResult>
  const signAndExecuteTransaction = useCallback(
    async (txb: Transaction): Promise<TransactionResult> => {
      try {
        const result = await signAndExecuteTransactionRaw({ transaction: txb });
        // Explicitly type effects to allow gasUsed property access
        const effects = result.effects as { gasUsed?: { computationCost?: number } } | undefined;
        return {
          success: true,
          transaction_hash: result.digest,
          gas_used:
            effects &&
            typeof effects === 'object' &&
            'gasUsed' in effects &&
            effects.gasUsed &&
            typeof effects.gasUsed === 'object' &&
            effects.gasUsed !== null &&
            'computationCost' in effects.gasUsed
              ? (effects.gasUsed as { computationCost: number }).computationCost
              : 0,
          digest: result.digest,
          effects: typeof result.effects === 'object' && result.effects !== null
            ? result.effects
            : {},
        };
      } catch (error: unknown) {
        return {
          success: false,
          error: error && typeof error === 'object' && 'message' in error
            ? (error as { message?: string }).message
            : 'Failed to execute transaction',
          digest: undefined,
          effects: {},
        };
      }
    },
    [signAndExecuteTransactionRaw]
  );

  // =================== Utility Functions ===================

  const showNotification = useCallback((
    type: NotificationType, 
    title: string, 
    message: string
  ) => {
    const notification: NotificationState = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: Date.now(),
      is_read: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
    }, 5000);
  }, []);

  const hideNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const setLoading = useCallback((key: string, loadingState: LoadingState) => {
    dispatch({ type: 'SET_LOADING_STATE', payload: { key, state: loadingState } });
  }, []);

  const isLoading = useCallback((key: string) => {
    return state.loadingStates[key] === 'loading';
  }, [state.loadingStates]);

  const shouldRefetch = useCallback((key: string, maxAge: number = 60000) => {
    const lastFetch = state.lastFetchTime[key];
    return !lastFetch || Date.now() - lastFetch > maxAge;
  }, [state.lastFetchTime]);

  // =================== Wallet Functions ===================

  const connectWallet = useCallback(async () => {
    try {
      setLoading('connectWallet', 'loading');
      
      if (!currentAccount) {
        throw new Error('No wallet account available');
      }

      const balance = await suiService.getBalance(currentAccount.address);
      
      const walletState: WalletState = {
        isConnected: true,
        address: currentAccount.address,
        balance,
        network: 'testnet',
      };

      dispatch({ type: 'SET_WALLET_STATE', payload: walletState });
      setLoading('connectWallet', 'success');
      
      showNotification('success', 'Wallet Connected', 'Successfully connected to Sui wallet');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setLoading('connectWallet', 'error');
      showNotification('error', 'Connection Failed', 'Failed to connect wallet');
    }
  }, [currentAccount, setLoading, showNotification]);

  const disconnectWallet = useCallback(() => {
    dispatch({ type: 'SET_WALLET_STATE', payload: initialState.wallet });
    dispatch({ type: 'RESET_STATE' });
    showNotification('info', 'Wallet Disconnected', 'Wallet has been disconnected');
  }, [showNotification]);

  const refreshBalance = useCallback(async () => {
    if (!state.wallet.address) return;

    try {
      const balance = await suiService.getBalance(state.wallet.address);
      dispatch({ 
        type: 'SET_WALLET_STATE', 
        payload: { ...state.wallet, balance }
      });
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  }, [state.wallet]);

  // =================== NFT Functions ===================

  const fetchUserNfts = useCallback(async () => {
    if (!state.wallet.address) return;

    try {
      setLoading('fetchUserNfts', 'loading');
      
      const nfts = await suiService.getUserNFTs(state.wallet.address);
      dispatch({ type: 'SET_USER_NFTS', payload: nfts });
      dispatch({ type: 'SET_LAST_FETCH_TIME', payload: { key: 'userNfts', time: Date.now() } });
      
      setLoading('fetchUserNfts', 'success');
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      setLoading('fetchUserNfts', 'error');
      showNotification('error', 'Fetch Failed', 'Failed to load your NFTs');
    }
  }, [state.wallet.address, setLoading, showNotification]);

  const mintNft = useCallback(async (nftData: NFTCreationData): Promise<TransactionResult> => {
    if (!state.wallet.address) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading('mintNft', 'loading');

      const result = await suiService.mintNFT(
        state.wallet.address,
        nftData,
        signAndExecuteTransaction
      );

      if (result.success) {
        setLoading('mintNft', 'success');
        showNotification('success', 'NFT Minted', 'Your dynamic NFT has been created successfully!');
        // Refresh user NFTs
        await fetchUserNfts();
      } else {
        throw new Error(result.error || 'Failed to mint NFT');
      }

      return result;
    } catch (error) {
      console.error('Error minting NFT:', error);
      setLoading('mintNft', 'error');
      showNotification('error', 'Minting Failed', error instanceof Error ? error.message : 'Failed to mint NFT');
      throw error;
    }
  }, [state.wallet.address, setLoading, signAndExecuteTransaction, showNotification, fetchUserNfts]);

  const fetchAllNfts = useCallback(async () => {
    try {
      setLoading('fetchAllNfts', 'loading');
      
      const nfts = await suiService.getAllNFTs();
      dispatch({ type: 'SET_ALL_NFTS', payload: nfts });
      dispatch({ type: 'SET_LAST_FETCH_TIME', payload: { key: 'allNfts', time: Date.now() } });
      
      setLoading('fetchAllNfts', 'success');
    } catch (error) {
      console.error('Error fetching all NFTs:', error);
      setLoading('fetchAllNfts', 'error');
    }
  }, [setLoading]);

  const selectNft = useCallback((nft: LiveArtNFT | null) => {
    dispatch({ type: 'SET_SELECTED_NFT', payload: nft });
  }, []);

  // =================== Marketplace Functions ===================

  const fetchListings = useCallback(async () => {
    try {
      setLoading('fetchListings', 'loading');
      
      const listings = await suiService.getMarketplaceListings();
      dispatch({ type: 'SET_LISTINGS', payload: listings });
      dispatch({ type: 'SET_LAST_FETCH_TIME', payload: { key: 'listings', time: Date.now() } });
      
      setLoading('fetchListings', 'success');
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading('fetchListings', 'error');
    }
  }, [setLoading]);

  const listNft = useCallback(async (nftId: string, price: number): Promise<TransactionResult> => {
    if (!state.wallet.address) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading('listNft', 'loading');

      // This would need marketplace object ID in production
      const marketplaceId = '0x...'; // TODO: Get from environment or contract
      
      const result = await suiService.listNFT(
        nftId,
        price,
        marketplaceId,
        signAndExecuteTransaction
      );

      if (result.success) {
        setLoading('listNft', 'success');
        showNotification('success', 'NFT Listed', 'Your NFT has been listed for sale!');
        await fetchListings();
      } else {
        throw new Error(result.error || 'Failed to list NFT');
      }

      return result;
    } catch (error) {
      console.error('Error listing NFT:', error);
      setLoading('listNft', 'error');
      showNotification('error', 'Listing Failed', error instanceof Error ? error.message : 'Failed to list NFT');
      throw error;
    }
  }, [state.wallet.address, signAndExecuteTransaction, setLoading, showNotification, fetchListings]);

  const buyNft = useCallback(async (nftId: string): Promise<TransactionResult> => {
    if (!state.wallet.address) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading('buyNft', 'loading');

      const marketplaceId = '0x...'; // TODO: Get from environment
      const paymentCoinId = '0x...'; // TODO: Get user's coin object
      
      const result = await suiService.buyNFT(
        nftId,
        marketplaceId,
        paymentCoinId,
        signAndExecuteTransaction
      );

      if (result.success) {
        setLoading('buyNft', 'success');
        showNotification('success', 'Purchase Complete', 'NFT purchased successfully!');
        await fetchUserNfts();
        await fetchListings();
      } else {
        throw new Error(result.error || 'Failed to buy NFT');
      }

      return result;
    } catch (error) {
      console.error('Error buying NFT:', error);
      setLoading('buyNft', 'error');
      showNotification('error', 'Purchase Failed', error instanceof Error ? error.message : 'Failed to buy NFT');
      throw error;
    }
  }, [state.wallet.address, setLoading, signAndExecuteTransaction, showNotification, fetchUserNfts, fetchListings]);

  const delistNft = useCallback(async (nftId: string): Promise<TransactionResult> => {
    if (!state.wallet.address) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading('delistNft', 'loading');

      const marketplaceId = '0x...'; // TODO: Get from environment
      
      const result = await suiService.delistNFT(
        nftId,
        marketplaceId,
        signAndExecuteTransaction
      );

      if (result.success) {
        setLoading('delistNft', 'success');
        showNotification('success', 'NFT Delisted', 'Your NFT has been removed from sale');
        await fetchListings();
      } else {
        throw new Error(result.error || 'Failed to delist NFT');
      }

      return result;
    } catch (error) {
      console.error('Error delisting NFT:', error);
      setLoading('delistNft', 'error');
      showNotification('error', 'Delisting Failed', error instanceof Error ? error.message : 'Failed to delist NFT');
      throw error;
    }
  }, [state.wallet.address, setLoading, signAndExecuteTransaction, showNotification, fetchListings]);

  const fetchMarketplaceStats = useCallback(async () => {
    try {
      setLoading('fetchMarketplaceStats', 'loading');
      
      // Calculate stats from listings - in production this would come from indexer
      const totalVolume = state.listings.reduce((sum, listing) => sum + listing.price, 0);
      const totalSales = state.listings.filter(l => l.status === 'sold').length;
      const averagePrice = totalVolume / Math.max(totalSales, 1);
      const activeListings = state.listings.filter(l => l.status === 'active').length;

      const stats: MarketplaceStats = {
        total_volume: totalVolume,
        total_sales: totalSales,
        average_price: averagePrice,
        active_listings: activeListings,
        fee_percentage: 2.5,
      };

      dispatch({ type: 'SET_MARKETPLACE_STATS', payload: stats });
      setLoading('fetchMarketplaceStats', 'success');
    } catch (error) {
      console.error('Error fetching marketplace stats:', error);
      setLoading('fetchMarketplaceStats', 'error');
    }
  }, [state.listings, setLoading]);

  // =================== Data Feed Functions ===================

  const fetchDataFeeds = useCallback(async () => {
    try {
      setLoading('fetchDataFeeds', 'loading');
      
      // Mock data feeds - in production this would come from API
      const feeds: DataFeed[] = [
        {
          id: 'btc-usd',
          name: 'Bitcoin/USD',
          description: 'Real-time Bitcoin price from Pyth Network',
          provider: 'pyth',
          endpoint: 'https://hermes.pyth.network',
          update_frequency: 1,
          is_active: true,
          last_updated: Date.now(),
          price_feed_id: '0xe62df6c8b4c85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
        },
        {
          id: 'eth-usd',
          name: 'Ethereum/USD',
          description: 'Real-time Ethereum price from Pyth Network',
          provider: 'pyth',
          endpoint: 'https://hermes.pyth.network',
          update_frequency: 1,
          is_active: true,
          last_updated: Date.now(),
          price_feed_id: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
        },
      ];

      dispatch({ type: 'SET_DATA_FEEDS', payload: feeds });
      dispatch({ type: 'SET_ACTIVE_FEEDS', payload: feeds.filter(f => f.is_active) });
      
      setLoading('fetchDataFeeds', 'success');
    } catch (error) {
      console.error('Error fetching data feeds:', error);
      setLoading('fetchDataFeeds', 'error');
    }
  }, [setLoading]);

  const toggleDataFeed = useCallback((feedId: string) => {
    const updatedFeeds = state.dataFeeds.map(feed => 
      feed.id === feedId ? { ...feed, is_active: !feed.is_active } : feed
    );
    
    dispatch({ type: 'SET_DATA_FEEDS', payload: updatedFeeds });
    dispatch({ type: 'SET_ACTIVE_FEEDS', payload: updatedFeeds.filter(f => f.is_active) });
  }, [state.dataFeeds]);

  // =================== Effects ===================

  // Update wallet state when account changes
  useEffect(() => {
    if (currentAccount) {
      connectWallet();
    } else {
      disconnectWallet();
    }
  }, [currentAccount, connectWallet, disconnectWallet]);

  // Initial data fetching
  useEffect(() => {
    if (state.wallet.isConnected && shouldRefetch('userNfts')) {
      fetchUserNfts();
    }
  }, [state.wallet.isConnected, fetchUserNfts, shouldRefetch]);

  useEffect(() => {
    if (shouldRefetch('dataFeeds', 300000)) { // 5 minutes
      fetchDataFeeds();
    }
  }, [fetchDataFeeds, shouldRefetch]);

  // =================== Context Value ===================

  const contextValue: NftContextType = {
    state,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    mintNft,
    fetchUserNfts,
    fetchAllNfts,
    selectNft,
    listNft,
    buyNft,
    delistNft,
    fetchListings,
    fetchMarketplaceStats,
    fetchDataFeeds,
    toggleDataFeed,
    showNotification,
    hideNotification,
    setLoading,
    isLoading,
    shouldRefetch,
  };

  return (
    <NftContext.Provider value={contextValue}>
      {children}
    </NftContext.Provider>
  );
}

// =================== Hook ===================
// Moved to useNft.ts to support Fast Refresh