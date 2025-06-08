import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, TrendingUp, TrendingDown, Minus, Eye, Share2 } from 'lucide-react';
import type { LiveArtNFT, Listing } from '../types';
import NFTStateVisualization from '../nft/NFTStateVisualization';
import { NftContext } from '../../context/NftContext';
import toast from 'react-hot-toast';

interface NFTCardProps {
  nft: LiveArtNFT;
  listing?: Listing;
  size?: 'small' | 'medium' | 'large';
  showActions?: boolean;
  showPrice?: boolean;
  className?: string;
}

const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  listing,
  size = 'medium',
  showActions = true,
  showPrice = true,
  className = ''
}) => {
  const nftContext = React.useContext(NftContext);
  const buyNft = nftContext?.buyNft;
  // const addToFavorites = nftContext?.addToFavorites;
  const isLoading = typeof nftContext?.isLoading === 'boolean' ? nftContext.isLoading : false;
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations
  const sizeConfig = {
    small: {
      card: 'w-64 h-80',
      content: 'p-3',
      title: 'text-sm',
      description: 'text-xs',
      button: 'text-xs px-2 py-1'
    },
    medium: {
      card: 'w-80 h-96',
      content: 'p-4',
      title: 'text-lg',
      description: 'text-sm',
      button: 'text-sm px-3 py-2'
    },
    large: {
      card: 'w-96 h-[28rem]',
      content: 'p-6',
      title: 'text-xl',
      description: 'text-base',
      button: 'text-base px-4 py-2'
    }
  };

  const config = sizeConfig[size];

  // Handle actions
  const handleBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!listing) {
      toast.error('NFT is not listed for sale');
      return;
    }

    try {
      if (buyNft) {
        await buyNft(listing.id);
        toast.success('NFT purchased successfully!');
      } else {
        toast.error('Buy function is not available');
      }
    } catch (error) {
      toast.error('Failed to purchase NFT');
      console.error('Purchase error:', error);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: nft.name,
        text: nft.description,
        url: `${window.location.origin}/nft/${nft.id}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/nft/${nft.id}`);
      toast.success('Link copied to clipboard!');
    }
  };

  // Get trend icon and color
  const getTrendInfo = () => {
    switch (nft.trend) {
      case 'bullish':
        return { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/20' };
      case 'bearish':
        return { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-400/20' };
      default:
        return { icon: Minus, color: 'text-gray-400', bg: 'bg-gray-400/20' };
    }
  };

  const trendInfo = getTrendInfo();
  const TrendIcon = trendInfo.icon;

  // Format time since last update
  const getTimeSinceUpdate = () => {
    const diffMs = Date.now() - nft.last_updated;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <Link to={`/nft/${nft.id}`} className="block">
      <div
        className={`
          ${config.card} ${className}
          bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl
          hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/25
          transition-all duration-300 transform hover:-translate-y-1
          cursor-pointer overflow-hidden group
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* NFT Visualization Container */}
        <div className="relative p-4 flex justify-center">
          <NFTStateVisualization
            nft={nft}
            size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
            showTransformations={isHovered}
          />

          {/* Top Action Buttons */}
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleLike}
              className={`p-1.5 rounded-lg backdrop-blur-sm border border-white/20 transition-colors ${
                isLiked ? 'bg-red-500/20 text-red-400' : 'bg-black/40 text-white hover:bg-white/20'
              }`}
            >
              <Heart size={14} className={isLiked ? 'fill-current' : ''} />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
            >
              <Share2 size={14} />
            </button>
          </div>

          {/* Volatility Badge */}
          {nft.volatility === 'high' && (
            <div className="absolute top-2 left-2">
              <div className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-md text-yellow-400 text-xs font-medium">
                High Vol
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={config.content}>
          {/* Header with Title and Trend */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className={`${config.title} font-bold text-white truncate`}>
                {nft.name}
              </h3>
              <p className={`${config.description} text-gray-400 line-clamp-2 mt-1`}>
                {nft.description}
              </p>
            </div>
            
            <div className={`flex items-center space-x-1 ${trendInfo.bg} px-2 py-1 rounded-lg ml-2`}>
              <TrendIcon size={16} className={trendInfo.color} />
              <span className={`text-xs font-medium ${trendInfo.color}`}>
                {nft.trend.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Market Data */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs text-gray-400">Market Value</p>
              <p className="text-lg font-bold text-white">${nft.market_value.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Sentiment</p>
              <div className="flex items-center space-x-1">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      nft.sentiment_score >= 7 ? 'bg-green-400' :
                      nft.sentiment_score >= 4 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${(nft.sentiment_score / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-white font-medium">{nft.sentiment_score}/10</span>
              </div>
            </div>
          </div>

          {/* Price and Actions */}
          {showPrice && listing && (
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400">List Price</p>
                <p className="text-xl font-bold text-purple-400">{listing.price} SUI</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Updated</p>
                <p className="text-xs text-white">{getTimeSinceUpdate()}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className="flex space-x-2">
              {listing ? (
                <button
                  onClick={handleBuy}
                  disabled={isLoading}
                  className={`
                    flex-1 ${config.button} bg-purple-600 hover:bg-purple-700
                    disabled:bg-gray-600 disabled:cursor-not-allowed
                    text-white font-medium rounded-lg transition-colors
                    flex items-center justify-center space-x-1
                  `}
                >
                  <ShoppingCart size={16} />
                  <span>{isLoading ? 'Buying...' : 'Buy Now'}</span>
                </button>
              ) : (
                <button
                  className={`
                    flex-1 ${config.button} bg-slate-700 hover:bg-slate-600
                    text-white font-medium rounded-lg transition-colors
                    flex items-center justify-center space-x-1
                  `}
                >
                  <Eye size={16} />
                  <span>View Details</span>
                </button>
              )}
            </div>
          )}

          {/* Data Source */}
          <div className="mt-2 pt-2 border-t border-white/10">
            <p className="text-xs text-gray-500">
              Data: <span className="text-purple-400">{nft.data_source}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NFTCard;