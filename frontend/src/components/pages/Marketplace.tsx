import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import NFTCard from '../marketplace/NFTCard';
import { useContext } from 'react';
import { NftContext } from '../../context/NftContext';

const Marketplace: React.FC = () => {
  const nftContext = useContext(NftContext);
  const nfts = nftContext?.state.allNfts ?? [];
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'recent'>('recent');

  // Filter NFTs for marketplace (only listed ones)
  const listedNfts = nfts.filter(nft => nft.is_listed);

  // Apply search and sort
  const filteredNfts = listedNfts
    .filter(nft => 
      nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (a.list_price || 0) - (b.list_price || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
        default:
          return (b.created_at || 0) - (a.created_at || 0);
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            NFT Marketplace
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Buy and sell dynamic NFTs that evolve with real-world data
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'name' | 'recent')}
                className="px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
              >
                <option value="recent">Recently Listed</option>
                <option value="price">Price: Low to High</option>
                <option value="name">Name: A to Z</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-black/30 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        {filteredNfts.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No NFTs Found</h3>
            <p className="text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'No NFTs are currently listed for sale'}
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredNfts.map((nft) => (
              <div 
                key={nft.id}
                className={viewMode === 'list' ? 'border border-purple-500/20 rounded-xl p-4 bg-white/5' : ''}
              >
                <NFTCard 
                  nft={nft} 
                  showPrice={true}
                />
                {viewMode === 'list' && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                      {nft.data_source}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                      {nft.volatility} volatility
                    </span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                      {nft.trend}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Showing {filteredNfts.length} of {listedNfts.length} listed NFTs
          </p>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;