import React, { useState } from 'react';
import { 
  Eye, 
  Heart, 
  TrendingUp, 
  Edit3, 
  ShoppingCart, 
  Trash2, 
  BarChart3,
  Plus,
  DollarSign,
  Clock,
  Activity,
  Search,
  Grid,
  List,
  ExternalLink
} from 'lucide-react';
import type { LiveArtNFT } from '../types';

interface CreatorDashboardProps {
  creatorAddress?: string;
  onEditNFT?: (nft: LiveArtNFT) => void;
  onCreateNew?: () => void;
}

interface NFTAnalytics {
  views: number;
  likes: number;
  transformations: number;
  revenue: number;
  lastSale?: number;
}

interface DashboardStats {
  totalNFTs: number;
  totalRevenue: number;
  totalViews: number;
  totalLikes: number;
  activeListings: number;
  avgPrice: number;
}

interface ExtendedLiveArtNFT extends LiveArtNFT {
  is_listed: boolean;
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  creatorAddress = "0x1234...5678",
  onEditNFT,
  onCreateNew
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'nfts' | 'analytics'>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'listed' | 'unlisted'>('all');

  // Mock data - Replace with actual data fetching
  const [createdNFTs] = useState<ExtendedLiveArtNFT[]>([
    {
      id: '1',
      name: 'Ethereum Pulse',
      description: 'Dynamic NFT tracking ETH price movements',
      image_url: '/api/placeholder/300/300',
      creator: creatorAddress,
      data_source: 'crypto_prices',
      market_value: 2.5,
      sentiment_score: 8,
      volatility: 'high',
      trend: 'bullish',
      last_updated: Date.now(),
      color_scheme: 'purple',
      animation_speed: 1.5,
      opacity: 0.9,
      is_listed: true,
      list_price: 2.5,
      created_at: Date.now() - 86400000,
    },
    {
      id: '2',
      name: 'Market Sentiment Wave',
      description: 'Responds to overall market sentiment',
      image_url: '/api/placeholder/300/300',
      creator: creatorAddress,
      data_source: 'market_sentiment',
      market_value: 1.8,
      sentiment_score: 6,
      volatility: 'medium',
      trend: 'neutral',
      last_updated: Date.now(),
      color_scheme: 'blue',
      animation_speed: 1.2,
      opacity: 0.8,
      is_listed: false,
      created_at: Date.now() - 172800000,
      list_price: undefined
    },
    {
      id: '3',
      name: 'Volatility Storm',
      description: 'Visual intensity matches market volatility',
      image_url: '/api/placeholder/300/300',
      creator: creatorAddress,
      data_source: 'volatility_index',
      market_value: 3.2,
      sentiment_score: 9,
      volatility: 'high',
      trend: 'bullish',
      last_updated: Date.now(),
      color_scheme: 'orange',
      animation_speed: 2.0,
      opacity: 1.0,
      is_listed: true,
      list_price: 3.2,
      created_at: Date.now() - 259200000,
    }
  ]);

  const [nftAnalytics] = useState<Record<string, NFTAnalytics>>({
    '1': { views: 1547, likes: 89, transformations: 234, revenue: 5.2, lastSale: 2.5 },
    '2': { views: 892, likes: 43, transformations: 156, revenue: 1.8 },
    '3': { views: 2103, likes: 142, transformations: 387, revenue: 8.9, lastSale: 3.2 }
  });

  const dashboardStats: DashboardStats = {
    totalNFTs: createdNFTs.length,
    totalRevenue: Object.values(nftAnalytics).reduce((sum, analytics) => sum + analytics.revenue, 0),
    totalViews: Object.values(nftAnalytics).reduce((sum, analytics) => sum + analytics.views, 0),
    totalLikes: Object.values(nftAnalytics).reduce((sum, analytics) => sum + analytics.likes, 0),
    activeListings: createdNFTs.filter(nft => nft.is_listed).length,
    avgPrice: createdNFTs.filter(nft => nft.is_listed).reduce((sum, nft) => sum + (typeof nft.list_price === 'number' ? nft.list_price : 0), 0) / createdNFTs.filter(nft => nft.is_listed).length
  };

  const filteredNFTs = createdNFTs.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'listed' && nft.is_listed) ||
                         (filterStatus === 'unlisted' && !nft.is_listed);
    return matchesSearch && matchesFilter;
  });

  const handleEditNFT = (nft: ExtendedLiveArtNFT) => {
    onEditNFT?.(nft);
  };

  const handleListNFT = (nft: ExtendedLiveArtNFT) => {
    // TODO: Implement listing functionality
    console.log('List NFT:', nft.id);
  };

  const handleDelistNFT = (nft: ExtendedLiveArtNFT) => {
    // TODO: Implement delisting functionality
    console.log('Delist NFT:', nft.id);
  };

  const renderStatsCard = (icon: React.ReactNode, title: string, value: string | number, change?: string) => (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          {icon}
        </div>
        {change && (
          <span className="text-sm text-green-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </div>
  );

  const renderNFTCard = (nft: ExtendedLiveArtNFT) => {
    const analytics = nftAnalytics[nft.id];
    
    return (
      <div key={nft.id} className="bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 overflow-hidden">
        <div className="relative">
          <img 
            src={nft.image_url} 
            alt={nft.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {nft.is_listed && (
              <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                Listed
              </div>
            )}
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              nft.trend === 'bullish' ? 'bg-green-500/20 text-green-400' :
              nft.trend === 'bearish' ? 'bg-red-500/20 text-red-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {nft.trend}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">{nft.name}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{nft.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{analytics.views}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{analytics.likes}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{analytics.transformations}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{analytics.revenue} SUI</span>
            </div>
          </div>
          
          {nft.is_listed && (
            <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Listed Price</span>
                <span className="text-white font-semibold">{nft.list_price} SUI</span>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <button 
              onClick={() => handleEditNFT(nft)}
              className="flex-1 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
            {nft.is_listed ? (
              <button 
                onClick={() => handleDelistNFT(nft)}
                className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delist
              </button>
            ) : (
              <button 
                onClick={() => handleListNFT(nft)}
                className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                List
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderNFTListItem = (nft: ExtendedLiveArtNFT) => {
    const analytics = nftAnalytics[nft.id];
    
    return (
      <div key={nft.id} className="bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 p-4">
        <div className="flex items-center gap-4">
          <img 
            src={nft.image_url} 
            alt={nft.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white">{nft.name}</h3>
              {nft.is_listed && (
                <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                  Listed
                </div>
              )}
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                nft.trend === 'bullish' ? 'bg-green-500/20 text-green-400' :
                nft.trend === 'bearish' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {nft.trend}
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-3">{nft.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {analytics.views}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {analytics.likes}
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4" />
                {analytics.transformations}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {analytics.revenue} SUI
              </div>
              {nft.is_listed && (
                <div className="flex items-center gap-1 text-green-400">
                  <ShoppingCart className="w-4 h-4" />
                  {nft.list_price} SUI
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => handleEditNFT(nft)}
              className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 p-2 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            {nft.is_listed ? (
              <button 
                onClick={() => handleDelistNFT(nft)}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 p-2 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => handleListNFT(nft)}
                className="bg-green-500/20 text-green-400 hover:bg-green-500/30 p-2 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            )}
            <button className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 p-2 rounded-lg transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Creator Dashboard
            </h1>
            <p className="text-gray-400">
              Manage your dynamic NFTs and track performance
            </p>
          </div>
          <button 
            onClick={onCreateNew}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New NFT
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-8 bg-gray-800/50 rounded-xl p-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'nfts', label: 'My NFTs', icon: Grid },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'nfts' | 'analytics')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderStatsCard(
                <Grid className="w-6 h-6 text-purple-400" />,
                'Total NFTs Created',
                dashboardStats.totalNFTs,
                '+12.5%'
              )}
              {renderStatsCard(
                <DollarSign className="w-6 h-6 text-green-400" />,
                'Total Revenue',
                `${dashboardStats.totalRevenue.toFixed(1)} SUI`,
                '+8.3%'
              )}
              {renderStatsCard(
                <Eye className="w-6 h-6 text-blue-400" />,
                'Total Views',
                dashboardStats.totalViews.toLocaleString(),
                '+15.2%'
              )}
              {renderStatsCard(
                <Heart className="w-6 h-6 text-red-400" />,
                'Total Likes',
                dashboardStats.totalLikes,
                '+9.7%'
              )}
              {renderStatsCard(
                <ShoppingCart className="w-6 h-6 text-yellow-400" />,
                'Active Listings',
                dashboardStats.activeListings,
                '+5.0%'
              )}
              {renderStatsCard(
                <TrendingUp className="w-6 h-6 text-purple-400" />,
                'Average Price',
                `${dashboardStats.avgPrice.toFixed(1)} SUI`,
                '+3.2%'
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { action: 'NFT "Ethereum Pulse" received 23 new views', time: '2 hours ago', type: 'view' },
                  { action: 'NFT "Volatility Storm" transformed 5 times', time: '4 hours ago', type: 'transform' },
                  { action: 'NFT "Market Sentiment Wave" was liked by 3 users', time: '6 hours ago', type: 'like' },
                  { action: 'NFT "Ethereum Pulse" sold for 2.5 SUI', time: '1 day ago', type: 'sale' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'view' ? 'bg-blue-400' :
                        activity.type === 'transform' ? 'bg-purple-400' :
                        activity.type === 'like' ? 'bg-red-400' :
                        'bg-green-400'
                      }`} />
                      <span className="text-gray-300">{activity.action}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NFTs Tab */}
        {activeTab === 'nfts' && (
          <div>
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your NFTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'listed' | 'unlisted')}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="all">All NFTs</option>
                <option value="listed">Listed Only</option>
                <option value="unlisted">Unlisted Only</option>
              </select>
              <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* NFTs Grid/List */}
            {filteredNFTs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Grid className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No NFTs found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Create your first dynamic NFT to get started'
                  }
                </p>
                <button 
                  onClick={onCreateNew}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Create New NFT
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredNFTs.map(viewMode === 'grid' ? renderNFTCard : renderNFTListItem)}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Performance Analytics
              </h3>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Advanced Analytics Coming Soon</h4>
                <p className="text-gray-400">
                  Detailed performance charts, transformation insights, and revenue analytics will be available here.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;