import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Eye, Heart, Share2 } from 'lucide-react';

// Types for the showcase NFT
interface ShowcaseNFT {
  id: string;
  name: string;
  creator: string;
  image_url: string;
  current_price: number;
  price_change_24h: number;
  sentiment_score: number;
  volatility: 'low' | 'medium' | 'high';
  trend: 'bullish' | 'bearish' | 'neutral';
  views: number;
  likes: number;
  last_updated: string;
}

const NFTShowcase: React.FC = () => {
  // Mock data for the featured NFT - in real app this would come from context/API
  const [featuredNFT] = useState<ShowcaseNFT>({
    id: '1',
    name: 'Quantum Shift',
    creator: 'CryptoArtist',
    image_url: '/api/placeholder/400/400',
    current_price: 12.5,
    price_change_24h: 8.3,
    sentiment_score: 7.8,
    volatility: 'medium',
    trend: 'bullish',
    views: 2847,
    likes: 156,
    last_updated: '2 minutes ago'
  });

  // Dynamic visual effects based on NFT data
  const [animationIntensity, setAnimationIntensity] = useState(1);
  const [colorScheme, setColorScheme] = useState('from-purple-500 to-blue-500');

  useEffect(() => {
    // Update visual properties based on NFT data
    const updateVisualProperties = () => {
      // Animation intensity based on volatility
      switch (featuredNFT.volatility) {
        case 'high':
          setAnimationIntensity(3);
          break;
        case 'medium':
          setAnimationIntensity(2);
          break;
        case 'low':
          setAnimationIntensity(1);
          break;
      }

      // Color scheme based on trend and sentiment
      if (featuredNFT.trend === 'bullish') {
        setColorScheme('from-green-400 to-emerald-600');
      } else if (featuredNFT.trend === 'bearish') {
        setColorScheme('from-red-400 to-rose-600');
      } else {
        setColorScheme('from-purple-500 to-blue-500');
      }
    };

    updateVisualProperties();
  }, [featuredNFT]);

  const getTrendIcon = () => {
    switch (featuredNFT.trend) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'bearish':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getVolatilityColor = () => {
    switch (featuredNFT.volatility) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Live Art
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Watch as this NFT transforms in real-time based on market data and sentiment
          </p>
        </div>

        {/* Main Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* NFT Visual Display */}
          <div className="relative">
            {/* Main NFT Container */}
            <div className="relative group">
              {/* Animated Background Glow */}
              <div 
                className={`absolute -inset-4 bg-gradient-to-r ${colorScheme} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-1000`}
                style={{
                  animation: `pulse ${3 / animationIntensity}s ease-in-out infinite`
                }}
              />
              
              {/* NFT Card */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500">
                {/* NFT Image */}
                <div className="aspect-square rounded-xl overflow-hidden mb-6 relative">
                  <img
                    src={featuredNFT.image_url}
                    alt={featuredNFT.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback gradient if image fails to load
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'block';
                    }}
                  />
                  {/* Fallback Gradient */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${colorScheme} flex items-center justify-center text-white text-2xl font-bold hidden`}
                  >
                    {featuredNFT.name.charAt(0)}
                  </div>
                  
                  {/* Live Indicator */}
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span>LIVE</span>
                  </div>
                </div>

                {/* NFT Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{featuredNFT.name}</h3>
                    <p className="text-gray-400">by {featuredNFT.creator}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
                      View Details
                    </button>
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                      <Heart className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                      <Share2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Data Panel */}
          <div className="space-y-6">
            {/* Price Section */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Live Price Data</h4>
              
              <div className="space-y-4">
                {/* Current Price */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Current Price</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">{featuredNFT.current_price} SUI</span>
                    <div className={`flex items-center space-x-1 ${featuredNFT.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {getTrendIcon()}
                      <span className="font-medium">
                        {featuredNFT.price_change_24h >= 0 ? '+' : ''}{featuredNFT.price_change_24h}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sentiment Score */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Sentiment Score</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${colorScheme}`}
                        style={{ width: `${(featuredNFT.sentiment_score / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-medium">{featuredNFT.sentiment_score}/10</span>
                  </div>
                </div>

                {/* Volatility */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Volatility</span>
                  <span className={`font-medium capitalize ${getVolatilityColor()}`}>
                    {featuredNFT.volatility}
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Activity</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-300 mb-1">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Views</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{featuredNFT.views.toLocaleString()}</span>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-300 mb-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Likes</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{featuredNFT.likes}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400 text-center">
                  Last updated: {featuredNFT.last_updated}
                </p>
              </div>
            </div>

            {/* Dynamic Properties Info */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
              <h4 className="text-lg font-semibold text-white mb-3">🎨 Dynamic Properties</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                This NFT's visual properties change in real-time based on market sentiment, 
                price volatility, and trading activity. Watch as colors, animations, and 
                effects adapt to reflect the current market conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NFTShowcase;