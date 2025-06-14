import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, TrendingUp, TrendingDown, Minus, Eye, Share2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { LiveArtNFT } from '../../types';
import { cn, formatPrice, formatTimeAgo } from '../../lib/utils';
import NFTStateVisualization from './NFTStateVisualization';
import toast from 'react-hot-toast';

interface NFTCardProps {
  nft: LiveArtNFT;
  size?: 'small' | 'medium' | 'large';
  showActions?: boolean;
  showPrice?: boolean;
  className?: string;
  onLike?: (nftId: string) => void;
  onBuy?: (nftId: string) => void;
}

export const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  size = 'medium',
  showActions = true,
  showPrice = true,
  className,
  onLike,
  onBuy
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(nft.id);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBuy?.(nft.id);
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

  const getTrendVariant = () => {
    switch (nft.trend) {
      case 'bullish':
        return 'bullish';
      case 'bearish':
        return 'bearish';
      default:
        return 'neutral';
    }
  };

  const getTrendIcon = () => {
    switch (nft.trend) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4" />;
      case 'bearish':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <Link to={`/nft/${nft.id}`} className="block">
      <Card
        className={cn(
          config.card,
          'bg-slate-800/50 backdrop-blur-sm border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group',
          className
        )}
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
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLike}
              className={cn(
                'h-8 w-8 rounded-lg backdrop-blur-sm border border-white/20 transition-colors',
                isLiked ? 'bg-red-500/20 text-red-400' : 'bg-black/40 text-white hover:bg-white/20'
              )}
            >
              <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleShare}
              className="h-8 w-8 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Volatility Badge */}
          {nft.volatility === 'high' && (
            <div className="absolute top-2 left-2">
              <Badge variant="warning" className="text-xs">
                High Vol
              </Badge>
            </div>
          )}
        </div>

        <CardContent className={config.content}>
          {/* Header with Title and Trend */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className={cn(config.title, 'font-bold text-white truncate')}>
                {nft.name}
              </h3>
              <p className={cn(config.description, 'text-gray-400 line-clamp-2 mt-1')}>
                {nft.description}
              </p>
            </div>
            
            <Badge variant={getTrendVariant()} className="ml-2 flex items-center gap-1">
              {getTrendIcon()}
              <span className="text-xs font-medium uppercase">
                {nft.trend}
              </span>
            </Badge>
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
                    className={cn(
                      'h-2 rounded-full',
                      nft.sentiment_score >= 7 ? 'bg-green-400' :
                      nft.sentiment_score >= 4 ? 'bg-yellow-400' : 'bg-red-400'
                    )}
                    style={{ width: `${(nft.sentiment_score / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-white font-medium">{nft.sentiment_score}/10</span>
              </div>
            </div>
          </div>

          {/* Price and Actions */}
          {showPrice && nft.is_listed && (
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400">List Price</p>
                <p className="text-xl font-bold text-purple-400">{nft.list_price} SUI</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Updated</p>
                <p className="text-xs text-white">{formatTimeAgo(nft.last_updated)}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className="flex space-x-2">
              {nft.is_listed ? (
                <Button
                  onClick={handleBuy}
                  variant="gradient"
                  className="flex-1 flex items-center justify-center space-x-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy Now</span>
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="flex-1 flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </Button>
              )}
            </div>
          )}

          {/* Data Source */}
          <div className="mt-2 pt-2 border-t border-white/10">
            <p className="text-xs text-gray-500">
              Data: <span className="text-purple-400">{nft.data_source}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NFTCard;