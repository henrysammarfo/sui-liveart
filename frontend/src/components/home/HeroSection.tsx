import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50"></div>
      
      {/* Content container */}
      <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Left column - Text Content */}
        <div className="text-center lg:text-left space-y-6 lg:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm text-purple-300 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Dynamic NFTs Powered by Real-World Data
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Living Art That
            </span>
            <br />
            <span className="text-white">
              Evolves with Reality
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-gray-300 text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Discover NFTs that transform in real-time based on market data, sentiment, and world events. 
            Your digital art becomes a living reflection of our dynamic world.
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
              <span className="flex items-center gap-2">
                Explore Live NFTs
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button className="px-8 py-4 border border-purple-500/50 text-purple-300 font-semibold rounded-xl hover:bg-purple-600/10 hover:border-purple-400 transition-all duration-300 backdrop-blur-sm">
              Create Dynamic Art
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 lg:pt-12">
            <div className="text-center lg:text-left">
              <div className="text-2xl lg:text-3xl font-bold text-white">2.4K+</div>
              <div className="text-gray-400 text-sm">Live NFTs</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl lg:text-3xl font-bold text-white">847</div>
              <div className="text-gray-400 text-sm">Creators</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl lg:text-3xl font-bold text-white">15.2M</div>
              <div className="text-gray-400 text-sm">SUI Volume</div>
            </div>
          </div>
        </div>
        
        {/* Right column - Featured NFT Preview */}
        <div className="relative mt-8 lg:mt-0">
          {/* Main NFT card */}
          <div className="relative group">
            {/* Background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            
            {/* NFT Card */}
            <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
              {/* NFT Image placeholder */}
              <div className="aspect-square bg-gradient-to-br from-purple-600/30 to-blue-600/30 relative overflow-hidden">
                {/* Animated elements representing dynamic NFT */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse"></div>
                <div className="absolute top-4 left-4 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 right-4 text-white/80 text-sm font-mono">
                  LIVE
                </div>
                
                {/* Center element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full opacity-60 animate-pulse"></div>
                </div>
              </div>
              
              {/* NFT Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Quantum Shift #001</h3>
                <p className="text-gray-400 text-sm mb-4">Transforms based on BTC price volatility</p>
                
                {/* Live data indicator */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    Current Value
                  </div>
                  <div className="text-white font-bold">12,105.4 SUI</div>
                </div>
                
                {/* Price indicator */}
                <div className="mt-3 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-lg text-sm text-purple-300">
                  📈 eth_price: 2850 • High Volatility
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-purple-400/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;