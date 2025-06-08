import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, Globe, Database } from 'lucide-react';

interface DataFeed {
  id: string;
  name: string;
  category: 'market' | 'weather' | 'social' | 'crypto';
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  description: string;
  lastUpdated: string;
  isActive: boolean;
}

const DataFeeds: React.FC = () => {
  const [feeds, setFeeds] = useState<DataFeed[]>([
    {
      id: '1',
      name: 'Bitcoin Price',
      category: 'crypto',
      value: '$67,432',
      change: 2.4,
      trend: 'up',
      description: 'Real-time Bitcoin price from major exchanges',
      lastUpdated: '2 minutes ago',
      isActive: true
    },
    {
      id: '2',
      name: 'Market Sentiment',
      category: 'market',
      value: 'Bullish',
      change: 15.2,
      trend: 'up',
      description: 'Overall market sentiment analysis',
      lastUpdated: '5 minutes ago',
      isActive: true
    },
    {
      id: '3',
      name: 'Weather Temperature',
      category: 'weather',
      value: '24°C',
      change: -1.8,
      trend: 'down',
      description: 'Global average temperature',
      lastUpdated: '1 hour ago',
      isActive: true
    },
    {
      id: '4',
      name: 'Social Volume',
      category: 'social',
      value: '1.2M',
      change: 8.7,
      trend: 'up',
      description: 'Social media mentions and engagement',
      lastUpdated: '10 minutes ago',
      isActive: false
    },
    {
      id: '5',
      name: 'Ethereum Gas',
      category: 'crypto',
      value: '45 Gwei',
      change: -12.3,
      trend: 'down',
      description: 'Average Ethereum network gas price',
      lastUpdated: '3 minutes ago',
      isActive: true
    },
    {
      id: '6',
      name: 'VIX Index',
      category: 'market',
      value: '18.4',
      change: 3.1,
      trend: 'up',
      description: 'Market volatility index',
      lastUpdated: '1 minute ago',
      isActive: true
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crypto':
        return <Zap className="w-5 h-5" />;
      case 'market':
        return <TrendingUp className="w-5 h-5" />;
      case 'weather':
        return <Globe className="w-5 h-5" />;
      case 'social':
        return <Activity className="w-5 h-5" />;
      default:
        return <Database className="w-5 h-5" />;
    }
  };

  const filteredFeeds = selectedCategory === 'all' 
    ? feeds 
    : feeds.filter(feed => feed.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Feeds', count: feeds.length },
    { id: 'crypto', name: 'Crypto', count: feeds.filter(f => f.category === 'crypto').length },
    { id: 'market', name: 'Market', count: feeds.filter(f => f.category === 'market').length },
    { id: 'weather', name: 'Weather', count: feeds.filter(f => f.category === 'weather').length },
    { id: 'social', name: 'Social', count: feeds.filter(f => f.category === 'social').length }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFeeds(prev => prev.map(feed => ({
        ...feed,
        change: feed.change + (Math.random() - 0.5) * 2,
        lastUpdated: 'Just now'
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Data Feeds
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time data sources that power dynamic NFT transformations
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Data Feeds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeeds.map(feed => (
            <div
              key={feed.id}
              className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border transition-all hover:scale-105 ${
                feed.isActive 
                  ? 'border-green-500/30 shadow-green-500/20' 
                  : 'border-gray-500/30'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    feed.category === 'crypto' ? 'bg-yellow-500/20 text-yellow-400' :
                    feed.category === 'market' ? 'bg-blue-500/20 text-blue-400' :
                    feed.category === 'weather' ? 'bg-green-500/20 text-green-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {getCategoryIcon(feed.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feed.name}</h3>
                    <span className="text-xs text-gray-400 capitalize">{feed.category}</span>
                  </div>
                </div>
                
                <div className={`w-3 h-3 rounded-full ${
                  feed.isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                }`} />
              </div>

              {/* Value and Trend */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">{feed.value}</span>
                  <div className={`flex items-center gap-1 text-sm ${
                    feed.trend === 'up' ? 'text-green-400' :
                    feed.trend === 'down' ? 'text-red-400' :
                    'text-gray-400'
                  }`}>
                    {feed.trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
                     feed.trend === 'down' ? <TrendingDown className="w-4 h-4" /> :
                     <Activity className="w-4 h-4" />}
                    {Math.abs(feed.change).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4">{feed.description}</p>

              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Updated: {feed.lastUpdated}</span>
                <span className={feed.isActive ? 'text-green-400' : 'text-gray-400'}>
                  {feed.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {feeds.filter(f => f.isActive).length}
            </div>
            <div className="text-gray-300">Active Feeds</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {feeds.filter(f => f.category === 'crypto').length}
            </div>
            <div className="text-gray-300">Crypto Feeds</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {feeds.filter(f => f.trend === 'up').length}
            </div>
            <div className="text-gray-300">Trending Up</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">30s</div>
            <div className="text-gray-300">Update Interval</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataFeeds;