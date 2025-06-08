import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NFTStateVisualization from '../nft/NFTStateVisualization';
import type { LiveArtNFT } from '../types';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Clock,
  User,
  Eye,
  DollarSign,
  Activity,
  Calendar
} from 'lucide-react';

const NFTDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNftById, loading, error } = useNftContext();
  const [nft, setNft] = useState<LiveArtNFT | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'activity'>('details');

  useEffect(() => {
    const fetchNft = async () => {
      if (id) {
        try {
          const nftData = await getNftById(id);
          setNft(nftData);
        } catch (err) {
          console.error('Failed to fetch NFT:', err);
        }
      }
    };

    fetchNft();
  }, [id, getNftById]);

  const handleShare = async () => {
    if (navigator.share && nft) {
      try {
        await navigator.share({
          title: nft.name,
          text: nft.description,
          url: window.location.href,
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'bearish':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'text-green-400 bg-green-400/10';
      case 'bearish':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">NFT Not Found</h2>
          <p className="text-gray-300 mb-6">The NFT you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/explore')}
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/explore')}
            className="inline-flex items-center px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-lg transition-colors ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/10 text-gray-300 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* NFT Visualization */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <NFTStateVisualization nft={nft} size="large" />
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Current Value</span>
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-xl font-bold text-white mt-1">
                  {formatPrice(nft.market_value)}
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Sentiment</span>
                  <Activity className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-xl font-bold text-white mt-1">
                  {nft.sentiment_score}/10
                </p>
              </div>
            </div>
          </div>

          {/* NFT Details */}
          <div className="space-y-6">
            {/* Title and Creator */}
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {nft.name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>By {nft.creator}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{nft.created_at ? formatDate(nft.created_at) : 'Unknown'}</span>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-3">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getTrendColor(nft.trend)}`}>
                {getTrendIcon(nft.trend)}
                <span className="ml-2 capitalize">{nft.trend}</span>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getVolatilityColor(nft.volatility)}`}>
                <Activity className="w-4 h-4 mr-2" />
                <span className="capitalize">{nft.volatility} Volatility</span>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm text-blue-400 bg-blue-400/10">
                <Eye className="w-4 h-4 mr-2" />
                <span>Live Data</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {showFullDescription || nft.description.length <= 200
                  ? nft.description
                  : `${nft.description.substring(0, 200)}...`
                }
              </p>
              {nft.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-purple-400 hover:text-purple-300 text-sm mt-2"
                >
                  {showFullDescription ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Purchase NFT
              </button>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors border border-white/20">
                Make Offer
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
              <div className="flex border-b border-white/10">
                {[
                  { id: 'details', label: 'Details' },
                  { id: 'history', label: 'History' },
                  { id: 'activity', label: 'Activity' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'details' | 'history' | 'activity')}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-purple-400 bg-purple-400/10'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Token ID</span>
                        <p className="text-white font-medium">{nft.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Data Source</span>
                        <p className="text-white font-medium">{nft.data_source}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Owner</span>
                        <p className="text-white font-medium">{nft.owner || 'Unknown'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Last Updated</span>
                        <p className="text-white font-medium">{formatDate(nft.last_updated)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    {nft.transformation_history && nft.transformation_history.length > 0 ? (
                      nft.transformation_history.map((transformation, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-white font-medium">Transformation #{index + 1}</p>
                            <p className="text-gray-400 text-sm">
                              {formatDate(transformation.timestamp || Date.now())}
                            </p>
                            <p className="text-gray-300 text-sm mt-1">
                              Visual properties updated based on market data
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No transformation history available</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No trading activity yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;

function useNftContext(): { 
  getNftById: (id: string) => Promise<LiveArtNFT>; 
  loading: boolean; 
  error: string | null; 
} {
    throw new Error('Function not implemented.');
}