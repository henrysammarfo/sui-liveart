import React, { useState, useMemo } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Minus, Grid3X3, List } from 'lucide-react';
import NFTCard from '../marketplace/NFTCard';
import type { LiveArtNFT } from '../types';

const Explore: React.FC = () => {
  const { nfts, loading, error } = useNftContext();
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [trendFilter, setTrendFilter] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');
  const [volatilityFilter, setVolatilityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'price' | 'volatility' | 'sentiment'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort NFTs
  const filteredAndSortedNfts = useMemo(() => {
    if (!nfts || nfts.length === 0) return [];

    const filtered = nfts.filter((nft: LiveArtNFT) => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.creator.toLowerCase().includes(searchTerm.toLowerCase());

      // Trend filter
      const matchesTrend = trendFilter === 'all' || nft.trend === trendFilter;

      // Volatility filter
      const matchesVolatility = volatilityFilter === 'all' || nft.volatility === volatilityFilter;

      return matchesSearch && matchesTrend && matchesVolatility;
    });

    // Sort NFTs
    filtered.sort((a: LiveArtNFT, b: LiveArtNFT) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case 'price':
          aValue = a.market_value;
          bValue = b.market_value;
          break;
        case 'sentiment':
          aValue = a.sentiment_score;
          bValue = b.sentiment_score;
          break;
        case 'volatility':
          { const volatilityOrder = { low: 1, medium: 2, high: 3 };
          aValue = volatilityOrder[a.volatility];
          bValue = volatilityOrder[b.volatility];
          break; }
        case 'created':
        default:
          aValue = a.created_at || 0;
          bValue = b.created_at || 0;
          break;
      }

      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    return filtered;
  }, [nfts, searchTerm, trendFilter, volatilityFilter, sortBy, sortOrder]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'bearish':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getVolatilityColor = (volatility: string) => {
    switch (volatility) {
      case 'high':
        return 'text-red-400 bg-red-400/10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'low':
        return 'text-green-400 bg-green-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-400">Loading dynamic NFTs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="text-red-400 text-lg mb-4">Error loading NFTs</div>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Explore Dynamic NFTs
        </h1>
        <p className="text-gray-400 text-lg">
          Discover NFTs that evolve with real-world data and market conditions
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search NFTs, creators, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Trend Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={trendFilter}
                onChange={(e) => setTrendFilter(e.target.value as 'all' | 'bullish' | 'bearish' | 'neutral')}
                className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Trends</option>
                <option value="bullish">🟢 Bullish</option>
                <option value="bearish">🔴 Bearish</option>
                <option value="neutral">⚪ Neutral</option>
              </select>
            </div>

            {/* Volatility Filter */}
            <select
              value={volatilityFilter}
              onChange={(e) => setVolatilityFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
              className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Volatility</option>
              <option value="low">Low Volatility</option>
              <option value="medium">Medium Volatility</option>
              <option value="high">High Volatility</option>
            </select>

            {/* Sort Options */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy as 'created' | 'price' | 'volatility' | 'sentiment');
                setSortOrder(newSortOrder as 'asc' | 'desc');
              }}
              className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="created-desc">Newest First</option>
              <option value="created-asc">Oldest First</option>
              <option value="price-desc">Highest Price</option>
              <option value="price-asc">Lowest Price</option>
              <option value="sentiment-desc">Most Bullish</option>
              <option value="sentiment-asc">Most Bearish</option>
              <option value="volatility-desc">Highest Volatility</option>
              <option value="volatility-asc">Lowest Volatility</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-gray-400">
          Showing {filteredAndSortedNfts.length} of {nfts?.length || 0} NFTs
        </div>
        
        {/* Active Filters */}
        {(trendFilter !== 'all' || volatilityFilter !== 'all' || searchTerm) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Active filters:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-sm">
                "{searchTerm}"
              </span>
            )}
            {trendFilter !== 'all' && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-sm flex items-center gap-1">
                {getTrendIcon(trendFilter)}
                {trendFilter}
              </span>
            )}
            {volatilityFilter !== 'all' && (
              <span className={`px-2 py-1 rounded-md text-sm ${getVolatilityColor(volatilityFilter)}`}>
                {volatilityFilter} volatility
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setTrendFilter('all');
                setVolatilityFilter('all');
              }}
              className="text-xs text-gray-400 hover:text-white underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* NFT Grid/List */}
      {filteredAndSortedNfts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-400 text-lg mb-4">No NFTs found</div>
          <p className="text-gray-500">
            {searchTerm || trendFilter !== 'all' || volatilityFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No dynamic NFTs have been created yet'}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {filteredAndSortedNfts.map((nft: LiveArtNFT) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              className={viewMode === 'list' ? 'flex flex-row' : ''}
            />
          ))}
        </div>
      )}

      {/* Load More / Pagination could go here */}
      {filteredAndSortedNfts.length > 0 && (
        <div className="mt-12 text-center">
          <div className="text-gray-400 text-sm">
            End of results • {filteredAndSortedNfts.length} NFTs displayed
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;

function useNftContext(): { nfts: LiveArtNFT[]; loading: boolean; error: string | null; } {
    throw new Error('Function not implemented.');
}
