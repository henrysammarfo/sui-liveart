import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background with geometric patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        {/* Geometric background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400/30 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-purple-400/30 rounded-full"></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-cyan-400/30 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 border border-blue-400/30 rounded-full"></div>
        </div>
      </div>

      {/* Content container */}
      <div className="relative z-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left column - Text content */}
        <div className="text-left space-y-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Dynamic NFTs
            </span>
            <br />
            <span className="text-white">
              Powered by Real-World Data
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            LiveArt Sui creates NFTs that evolve based on real-world events. 
            Leverage Sui blockchain's power for digital art that lives and breathes with data.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/explore')}
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              Explore Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/creator')}
              className="px-8 py-4 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              Creator Studio
            </button>
          </div>
        </div>

        {/* Right column - NFT showcase */}
        <div className="relative">
          <div className="relative group">
            {/* Main NFT display */}
            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500">
              {/* NFT Image placeholder */}
              <div className="aspect-square bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-xl overflow-hidden relative mb-4">
                {/* Robot/AI image placeholder - using a geometric pattern instead */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-60 animate-pulse flex items-center justify-center">
                    <Zap className="w-16 h-16 text-white" />
                  </div>
                </div>
                
                {/* Live indicator */}
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span>LIVE</span>
                </div>
              </div>
              
              {/* NFT Info overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <h3 className="text-white font-semibold text-lg mb-1">Quantum Shift</h3>
                <p className="text-blue-400 text-sm mb-2">
                  evolves with ETH price changes. Currently showing state at $2,850.
                </p>
                <div className="text-gray-300 text-sm">
                  Current Value: <span className="text-white font-semibold">$2,850</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards at bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Real-Time Updates */}
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Real-Time Updates</h3>
            <p className="text-gray-400 text-sm">
              NFTs that respond instantly to data changes
            </p>
          </div>

          {/* Sui Security */}
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-purple-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <h3 className="text-white font-semibold mb-2">Sui Security</h3>
            <p className="text-gray-400 text-sm">
              Built on Sui's secure Move-based blockchain
            </p>
          </div>

          {/* Multiple Data Sources */}
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 text-cyan-400">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-white font-semibold mb-2">Multiple Data Sources</h3>
            <p className="text-gray-400 text-sm">
              Connect to 50+ real-world data feeds
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;