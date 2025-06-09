// src/data/mockData.ts - Enhanced Mock Data for Phase 6
// Realistic NFT collections with diverse data sources and transformation histories

export interface NFTTransformation {
  timestamp: number;
  trigger: string;
  old_value: number;
  new_value: number;
  visual_change: string;
  data_source: string;
}

export interface LiveArtNFT {
  id: string;
  name: string;
  description: string;
  image_url: string;
  creator: string;
  creator_name: string;
  data_source: string;
  market_value: number;
  sentiment_score: number; // 1-10
  volatility: 'low' | 'medium' | 'high';
  trend: 'bullish' | 'bearish' | 'neutral';
  last_updated: number;
  color_scheme: string;
  animation_speed: number;
  opacity: number;
  owner?: string;
  created_at: number;
  transformation_history: NFTTransformation[];
  is_listed: boolean;
  list_price?: number;
  tags: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  total_transformations: number;
}

export interface CreatorProfile {
  address: string;
  name: string;
  avatar: string;
  bio: string;
  total_nfts: number;
  total_volume: number;
  followers: number;
  verified: boolean;
  joined_date: number;
  specialty: string[];
}

export interface DataSource {
  id: string;
  name: string;
  type: 'crypto' | 'weather' | 'social' | 'sports' | 'custom';
  endpoint: string;
  is_active: boolean;
  connected_nfts: number;
  last_update: number;
  reliability: number; // 1-100
  description: string;
  icon: string;
  price_per_use: number;
}

export interface MarketStats {
  total_nfts: number;
  active_creators: number;
  total_volume: number;
  daily_volume: number;
  average_price: number;
  transformation_count_24h: number;
}

// Enhanced Creator Profiles
export const mockCreators: CreatorProfile[] = [
  {
    address: '0x7ae...8df2',
    name: 'CryptoVisionary',
    avatar: '/api/placeholder/64/64',
    bio: 'Digital artist specializing in cryptocurrency-responsive art that evolves with market movements.',
    total_nfts: 23,
    total_volume: 45670,
    followers: 1247,
    verified: true,
    joined_date: Date.now() - 86400000 * 120, // 120 days ago
    specialty: ['Crypto Art', 'Market Data', 'Abstract']
  },
  {
    address: '0x3rd...9e21',
    name: 'WeatherWizard',
    avatar: '/api/placeholder/64/64',
    bio: 'Creating atmospheric NFTs that change with global weather patterns and climate data.',
    total_nfts: 18,
    total_volume: 32100,
    followers: 892,
    verified: true,
    joined_date: Date.now() - 86400000 * 87, // 87 days ago
    specialty: ['Weather Art', 'Climate Data', 'Landscapes']
  },
  {
    address: '0x20c...7a45',
    name: 'SocialPulse',
    avatar: '/api/placeholder/64/64',
    bio: 'NFTs that pulse with social media sentiment and trending topics across platforms.',
    total_nfts: 31,
    total_volume: 67890,
    followers: 2103,
    verified: true,
    joined_date: Date.now() - 86400000 * 156, // 156 days ago
    specialty: ['Social Media', 'Sentiment Analysis', 'Pop Culture']
  },
  {
    address: '0x5dc...4c87',
    name: 'SportsLegend',
    avatar: '/api/placeholder/64/64',
    bio: 'Dynamic sports collectibles that evolve based on real-time game statistics and player performance.',
    total_nfts: 42,
    total_volume: 89450,
    followers: 3456,
    verified: true,
    joined_date: Date.now() - 86400000 * 203, // 203 days ago
    specialty: ['Sports', 'Statistics', 'Gaming']
  },
  {
    address: '0x8fa...2b93',
    name: 'EcoArtist',
    avatar: '/api/placeholder/64/64',
    bio: 'Environmental NFTs that reflect real-time pollution levels and conservation efforts.',
    total_nfts: 15,
    total_volume: 21340,
    followers: 567,
    verified: false,
    joined_date: Date.now() - 86400000 * 45, // 45 days ago
    specialty: ['Environment', 'Conservation', 'Data Visualization']
  }
];

// Available Data Sources
export const mockDataSources: DataSource[] = [
  {
    id: 'btc-price',
    name: 'Bitcoin Price Feed',
    type: 'crypto',
    endpoint: 'https://api.pyth.network/v1/price/bitcoin',
    is_active: true,
    connected_nfts: 47,
    last_update: Date.now() - 30000, // 30 seconds ago
    reliability: 98,
    description: 'Real-time Bitcoin price data from Pyth Network',
    icon: '₿',
    price_per_use: 0.01
  },
  {
    id: 'eth-price',
    name: 'Ethereum Price Feed',
    type: 'crypto',
    endpoint: 'https://api.pyth.network/v1/price/ethereum',
    is_active: true,
    connected_nfts: 73,
    last_update: Date.now() - 45000, // 45 seconds ago
    reliability: 97,
    description: 'Live Ethereum price with confidence intervals',
    icon: 'Ξ',
    price_per_use: 0.01
  },
  {
    id: 'weather-global',
    name: 'Global Weather API',
    type: 'weather',
    endpoint: 'https://api.openweathermap.org/data/2.5/weather',
    is_active: true,
    connected_nfts: 29,
    last_update: Date.now() - 300000, // 5 minutes ago
    reliability: 94,
    description: 'Current weather conditions worldwide',
    icon: '🌤️',
    price_per_use: 0.005
  },
  {
    id: 'twitter-sentiment',
    name: 'Social Sentiment Tracker',
    type: 'social',
    endpoint: 'https://api.sentiment.com/v1/crypto',
    is_active: true,
    connected_nfts: 35,
    last_update: Date.now() - 120000, // 2 minutes ago
    reliability: 89,
    description: 'Real-time social media sentiment analysis',
    icon: '📱',
    price_per_use: 0.02
  },
  {
    id: 'nba-stats',
    name: 'NBA Live Stats',
    type: 'sports',
    endpoint: 'https://api.sportsdata.io/v3/nba/scores',
    is_active: true,
    connected_nfts: 18,
    last_update: Date.now() - 180000, // 3 minutes ago
    reliability: 96,
    description: 'Live NBA game statistics and player data',
    icon: '🏀',
    price_per_use: 0.015
  },
  {
    id: 'stock-sp500',
    name: 'S&P 500 Index',
    type: 'crypto',
    endpoint: 'https://api.polygon.io/v1/indices/SPX',
    is_active: false,
    connected_nfts: 8,
    last_update: Date.now() - 900000, // 15 minutes ago
    reliability: 85,
    description: 'S&P 500 market index data',
    icon: '📈',
    price_per_use: 0.03
  }
];

// Current Market Statistics
export const mockMarketStats: MarketStats = {
  total_nfts: 2847,
  active_creators: 847,
  total_volume: 15234567,
  daily_volume: 234561,
  average_price: 145.67,
  transformation_count_24h: 12493
};

// Enhanced NFT Collection with 50+ Diverse Examples
export const mockNFTs: LiveArtNFT[] = [
  // Crypto-responsive NFTs
  {
    id: 'nft_001',
    name: 'Quantum Shift #001',
    description: 'A digital sculpture that evolves based on ETH price movements. As ETH rises, the sculpture transitions from cool blues to vibrant golds.',
    image_url: '/api/placeholder/400/400',
    creator: '0x7ae...8df2',
    creator_name: 'CryptoVisionary',
    data_source: 'eth-price',
    market_value: 2850,
    sentiment_score: 8,
    volatility: 'high',
    trend: 'bullish',
    last_updated: Date.now() - 15000,
    color_scheme: 'gold-blue-gradient',
    animation_speed: 1.8,
    opacity: 0.9,
    owner: '0xabc...123',
    created_at: Date.now() - 86400000 * 45,
    is_listed: false,
    tags: ['crypto', 'ethereum', 'abstract', 'sculpture'],
    rarity: 'legendary',
    total_transformations: 1247,
    transformation_history: [
      {
        timestamp: Date.now() - 3600000,
        trigger: 'ETH price spike',
        old_value: 2750,
        new_value: 2850,
        visual_change: 'Increased gold intensity, faster pulse',
        data_source: 'eth-price'
      },
      {
        timestamp: Date.now() - 7200000,
        trigger: 'High volatility detected',
        old_value: 2680,
        new_value: 2750,
        visual_change: 'Added shimmer effect',
        data_source: 'eth-price'
      }
    ]
  },
  {
    id: 'nft_002',
    name: 'Bitcoin Phoenix',
    description: 'A mythical phoenix that grows more vibrant and animated as Bitcoin reaches new heights.',
    image_url: '/api/placeholder/400/400',
    creator: '0x7ae...8df2',
    creator_name: 'CryptoVisionary',
    data_source: 'btc-price',
    market_value: 4200,
    sentiment_score: 9,
    volatility: 'medium',
    trend: 'bullish',
    last_updated: Date.now() - 30000,
    color_scheme: 'orange-red-fire',
    animation_speed: 2.1,
    opacity: 0.95,
    created_at: Date.now() - 86400000 * 67,
    is_listed: true,
    list_price: 4500,
    tags: ['bitcoin', 'phoenix', 'mythology', 'fire'],
    rarity: 'legendary',
    total_transformations: 892,
    transformation_history: [
      {
        timestamp: Date.now() - 1800000,
        trigger: 'BTC all-time high',
        old_value: 67500,
        new_value: 68200,
        visual_change: 'Phoenix wings spread wider, flames intensified',
        data_source: 'btc-price'
      }
    ]
  },

  // Weather-responsive NFTs
  {
    id: 'nft_003',
    name: 'Weather Wanderer',
    description: 'A mystical landscape that mirrors real-time weather patterns from around the globe.',
    image_url: '/api/placeholder/400/400',
    creator: '0x3rd...9e21',
    creator_name: 'WeatherWizard',
    data_source: 'weather-global',
    market_value: 1240,
    sentiment_score: 6,
    volatility: 'low',
    trend: 'neutral',
    last_updated: Date.now() - 120000,
    color_scheme: 'blue-gray-storm',
    animation_speed: 0.8,
    opacity: 0.75,
    created_at: Date.now() - 86400000 * 23,
    is_listed: true,
    list_price: 1400,
    tags: ['weather', 'landscape', 'nature', 'dynamic'],
    rarity: 'rare',
    total_transformations: 456,
    transformation_history: [
      {
        timestamp: Date.now() - 600000,
        trigger: 'Rainy weather in Tokyo',
        old_value: 15,
        new_value: 8,
        visual_change: 'Added rain effect, darker clouds',
        data_source: 'weather-global'
      }
    ]
  },
  {
    id: 'nft_004',
    name: 'Climate Crystal',
    description: 'A crystalline formation that changes color and structure based on global temperature anomalies.',
    image_url: '/api/placeholder/400/400',
    creator: '0x8fa...2b93',
    creator_name: 'EcoArtist',
    data_source: 'weather-global',
    market_value: 890,
    sentiment_score: 4,
    volatility: 'low',
    trend: 'bearish',
    last_updated: Date.now() - 900000,
    color_scheme: 'ice-blue-white',
    animation_speed: 0.5,
    opacity: 0.8,
    created_at: Date.now() - 86400000 * 12,
    is_listed: false,
    tags: ['climate', 'crystal', 'environment', 'temperature'],
    rarity: 'epic',
    total_transformations: 123,
    transformation_history: []
  },

  // Social sentiment NFTs
  {
    id: 'nft_005',
    name: 'Market Pulse',
    description: 'An abstract visualization that pulses and changes based on social media sentiment around cryptocurrency.',
    image_url: '/api/placeholder/400/400',
    creator: '0x20c...7a45',
    creator_name: 'SocialPulse',
    data_source: 'twitter-sentiment',
    market_value: 1650,
    sentiment_score: 7,
    volatility: 'high',
    trend: 'bullish',
    last_updated: Date.now() - 60000,
    color_scheme: 'neon-pink-cyan',
    animation_speed: 3.2,
    opacity: 0.9,
    created_at: Date.now() - 86400000 * 34,
    is_listed: true,
    list_price: 1800,
    tags: ['social', 'sentiment', 'pulse', 'neon'],
    rarity: 'rare',
    total_transformations: 2341,
    transformation_history: [
      {
        timestamp: Date.now() - 300000,
        trigger: 'Positive crypto sentiment spike',
        old_value: 0.73,
        new_value: 0.89,
        visual_change: 'Brighter colors, faster pulse rate',
        data_source: 'twitter-sentiment'
      }
    ]
  },

  // Sports NFTs
  {
    id: 'nft_006',
    name: 'Sports Legend',
    description: 'A dynamic sports trophy that evolves based on NBA game statistics and player performance data.',
    image_url: '/api/placeholder/400/400',
    creator: '0x5dc...4c87',
    creator_name: 'SportsLegend',
    data_source: 'nba-stats',
    market_value: 3200,
    sentiment_score: 9,
    volatility: 'medium',
    trend: 'bullish',
    last_updated: Date.now() - 180000,
    color_scheme: 'gold-bronze-trophy',
    animation_speed: 1.5,
    opacity: 1.0,
    created_at: Date.now() - 86400000 * 78,
    is_listed: false,
    tags: ['sports', 'nba', 'trophy', 'statistics'],
    rarity: 'legendary',
    total_transformations: 567,
    transformation_history: [
      {
        timestamp: Date.now() - 7200000,
        trigger: 'Triple-double achieved',
        old_value: 89,
        new_value: 94,
        visual_change: 'Trophy grew taller, added sparkle effect',
        data_source: 'nba-stats'
      }
    ]
  },

  // More diverse NFTs to reach 50+ collection
  {
    id: 'nft_007',
    name: 'Volatility Vortex',
    description: 'A swirling vortex that spins faster and changes colors based on market volatility.',
    image_url: '/api/placeholder/400/400',
    creator: '0x7ae...8df2',
    creator_name: 'CryptoVisionary',
    data_source: 'btc-price',
    market_value: 1890,
    sentiment_score: 6,
    volatility: 'high',
    trend: 'neutral',
    last_updated: Date.now() - 45000,
    color_scheme: 'purple-violet-swirl',
    animation_speed: 2.8,
    opacity: 0.85,
    created_at: Date.now() - 86400000 * 56,
    is_listed: true,
    list_price: 2100,
    tags: ['volatility', 'vortex', 'crypto', 'motion'],
    rarity: 'epic',
    total_transformations: 789,
    transformation_history: []
  },
  {
    id: 'nft_008',
    name: 'Storm Chaser',
    description: 'A dynamic storm scene that tracks real hurricanes and weather systems globally.',
    image_url: '/api/placeholder/400/400',
    creator: '0x3rd...9e21',
    creator_name: 'WeatherWizard',
    data_source: 'weather-global',
    market_value: 2100,
    sentiment_score: 5,
    volatility: 'medium',
    trend: 'neutral',
    last_updated: Date.now() - 300000,
    color_scheme: 'dark-gray-lightning',
    animation_speed: 1.9,
    opacity: 0.9,
    created_at: Date.now() - 86400000 * 89,
    is_listed: false,
    tags: ['storm', 'hurricane', 'weather', 'dramatic'],
    rarity: 'rare',
    total_transformations: 234,
    transformation_history: []
  },
  {
    id: 'nft_009',
    name: 'Meme Momentum',
    description: 'A playful character that transforms based on trending memes and viral content.',
    image_url: '/api/placeholder/400/400',
    creator: '0x20c...7a45',
    creator_name: 'SocialPulse',
    data_source: 'twitter-sentiment',
    market_value: 850,
    sentiment_score: 8,
    volatility: 'high',
    trend: 'bullish',
    last_updated: Date.now() - 90000,
    color_scheme: 'rainbow-bright',
    animation_speed: 4.0,
    opacity: 1.0,
    created_at: Date.now() - 86400000 * 15,
    is_listed: true,
    list_price: 950,
    tags: ['meme', 'viral', 'social', 'trending'],
    rarity: 'common',
    total_transformations: 1567,
    transformation_history: []
  },
  {
    id: 'nft_010',
    name: 'Championship Ring',
    description: 'A championship ring that gains gems and effects based on team performance.',
    image_url: '/api/placeholder/400/400',
    creator: '0x5dc...4c87',
    creator_name: 'SportsLegend',
    data_source: 'nba-stats',
    market_value: 2750,
    sentiment_score: 7,
    volatility: 'low',
    trend: 'bullish',
    last_updated: Date.now() - 240000,
    color_scheme: 'gold-diamond-shine',
    animation_speed: 1.2,
    opacity: 0.95,
    created_at: Date.now() - 86400000 * 102,
    is_listed: true,
    list_price: 3000,
    tags: ['championship', 'ring', 'sports', 'achievement'],
    rarity: 'legendary',
    total_transformations: 345,
    transformation_history: []
  }
];

// Add 40 more NFTs to reach 50+ collection
const additionalNFTs: LiveArtNFT[] = Array.from({ length: 40 }, (_, i) => {
  const id = `nft_${String(i + 11).padStart(3, '0')}`;
  const creators = mockCreators;
  const sources = mockDataSources;
  const creator = creators[Math.floor(Math.random() * creators.length)];
  const source = sources[Math.floor(Math.random() * sources.length)];
  
  const rarities: LiveArtNFT['rarity'][] = ['common', 'rare', 'epic', 'legendary'];
  const volatilities: LiveArtNFT['volatility'][] = ['low', 'medium', 'high'];
  const trends: LiveArtNFT['trend'][] = ['bullish', 'bearish', 'neutral'];
  
  const names = [
    'Digital Horizon', 'Crypto Storm', 'Weather Pulse', 'Social Echo', 'Data Wave',
    'Market Spirit', 'Trend Rider', 'Value Shift', 'Signal Fire', 'Price Oracle',
    'Sentiment Mirror', 'Volatility Dance', 'Market Breath', 'Data Ghost', 'Trend Shadow',
    'Value Echo', 'Signal Wave', 'Price Phantom', 'Market Whisper', 'Data Stream',
    'Crypto Nebula', 'Weather Vortex', 'Social Ripple', 'Market Flow', 'Data Prism',
    'Trend Crystal', 'Value Spectrum', 'Signal Burst', 'Price Cascade', 'Market Resonance',
    'Data Constellation', 'Crypto Aurora', 'Weather Symphony', 'Social Harmony', 'Market Rhythm',
    'Trend Melody', 'Value Chord', 'Signal Note', 'Price Beat', 'Data Frequency'
  ];

  return {
    id,
    name: names[i] || `Dynamic NFT #${i + 11}`,
    description: `An evolving digital artwork that responds to ${source.name} data with unique visual transformations.`,
    image_url: '/api/placeholder/400/400',
    creator: creator.address,
    creator_name: creator.name,
    data_source: source.id,
    market_value: Math.floor(Math.random() * 5000) + 500,
    sentiment_score: Math.floor(Math.random() * 10) + 1,
    volatility: volatilities[Math.floor(Math.random() * volatilities.length)],
    trend: trends[Math.floor(Math.random() * trends.length)],
    last_updated: Date.now() - Math.floor(Math.random() * 3600000),
    color_scheme: ['blue-gradient', 'purple-gold', 'green-teal', 'red-orange', 'pink-cyan'][Math.floor(Math.random() * 5)],
    animation_speed: Math.random() * 3 + 0.5,
    opacity: Math.random() * 0.3 + 0.7,
    created_at: Date.now() - Math.floor(Math.random() * 86400000 * 200),
    is_listed: Math.random() > 0.5,
    list_price: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) + 500 : undefined,
    tags: ['dynamic', 'data-driven', source.type, 'evolving'],
    rarity: rarities[Math.floor(Math.random() * rarities.length)],
    total_transformations: Math.floor(Math.random() * 2000),
    transformation_history: []
  };
});

// Combine all NFTs
export const allMockNFTs = [...mockNFTs, ...additionalNFTs];

// Helper functions for data manipulation
export const getNFTsByCreator = (creatorAddress: string) => 
  allMockNFTs.filter(nft => nft.creator === creatorAddress);

export const getNFTsByDataSource = (sourceId: string) => 
  allMockNFTs.filter(nft => nft.data_source === sourceId);

export const getListedNFTs = () => 
  allMockNFTs.filter(nft => nft.is_listed);

export const getNFTsByRarity = (rarity: LiveArtNFT['rarity']) => 
  allMockNFTs.filter(nft => nft.rarity === rarity);

export const getTrendingNFTs = () => 
  allMockNFTs
    .filter(nft => nft.total_transformations > 500)
    .sort((a, b) => b.total_transformations - a.total_transformations)
    .slice(0, 10);

export const getRecentlyUpdatedNFTs = () => 
  allMockNFTs
    .sort((a, b) => b.last_updated - a.last_updated)
    .slice(0, 20);

// Export default mock data object
export const mockData = {
  nfts: allMockNFTs,
  creators: mockCreators,
  dataSources: mockDataSources,
  marketStats: mockMarketStats,
  // Helper functions
  getNFTsByCreator,
  getNFTsByDataSource, 
  getListedNFTs,
  getNFTsByRarity,
  getTrendingNFTs,
  getRecentlyUpdatedNFTs
};

export default mockData;