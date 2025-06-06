import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

// =================== Hero Section Component ===================

const HeroSection: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState(1247.89);
  const [isAnimating, setIsAnimating] = useState(false);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 50;
        return Math.max(1000, prev + change);
      });
      setTimeout(() => setIsAnimating(false), 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Dynamic NFTs Powered by Real-World Data
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Living Art That
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Evolves with Reality
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Discover NFTs that transform in real-time based on market data, sentiment, and world events. 
              Your digital art becomes a living reflection of our dynamic world.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/explore"
                className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                Explore Live NFTs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                to="/creator"
                className="inline-flex items-center px-8 py-4 rounded-xl bg-slate-800/50 border border-slate-600 text-white font-semibold hover:bg-slate-700/50 transition-all duration-300 backdrop-blur-sm"
              >
                Create Dynamic Art
                <Sparkles className="w-5 h-5 ml-2" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-slate-700/50">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">2.4K+</div>
                <div className="text-sm text-gray-400">Live NFTs</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">847</div>
                <div className="text-sm text-gray-400">Creators</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">15.2M</div>
                <div className="text-sm text-gray-400">SUI Volume</div>
              </div>
            </div>
          </div>

          {/* Right Content - Featured NFT Preview */}
          <div className="relative">
            {/* Featured NFT Card */}
            <div className="relative max-w-md mx-auto">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl opacity-20 blur-2xl animate-pulse" />
              
              {/* NFT Card */}
              <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 shadow-2xl">
                {/* NFT Image Placeholder with Dynamic Colors */}
                <div className={`aspect-square rounded-xl mb-4 bg-gradient-to-br transition-all duration-1000 ${
                  isAnimating 
                    ? 'from-purple-600 via-pink-500 to-blue-600' 
                    : 'from-blue-600 via-purple-500 to-pink-600'
                } flex items-center justify-center relative overflow-hidden`}>
                  {/* Animated Patterns */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/20 rounded-full animate-bounce" />
                    <div className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-white/15 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
                  </div>
                  
                  {/* Center Icon */}
                  <Activity className="w-16 h-16 text-white/80" />
                </div>

                {/* NFT Info */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">Quantum Shift #001</h3>
                  <p className="text-gray-400 text-sm">Transforms based on BTC price volatility</p>
                  
                  {/* Live Price Display */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className={`w-4 h-4 transition-colors duration-300 ${
                        isAnimating ? 'text-green-400' : 'text-blue-400'
                      }`} />
                      <span className="text-sm text-gray-400">Current Value</span>
                    </div>
                    <div className={`text-lg font-bold transition-all duration-300 ${
                      isAnimating ? 'text-green-400 scale-110' : 'text-white'
                    }`}>
                      {currentPrice.toFixed(2)} SUI
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      Live Updates
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      High Volatility
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;