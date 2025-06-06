import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, ShoppingBag, TrendingUp, Zap, ArrowRight, Sparkles } from 'lucide-react';

const CallToActionSection: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateNFT = () => {
    navigate('/creator');
  };

  const handleExploreMarketplace = () => {
    navigate('/marketplace');
  };

  const handleExploreAll = () => {
    navigate('/explore');
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main CTA Container */}
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-3xl blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl" />
          
          {/* Content */}
          <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  Ready to{' '}
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Transform
                  </span>{' '}
                  Art?
                </h2>
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Join the future of digital art where creativity meets real-world data. 
                Create dynamic NFTs that evolve with market conditions and global events.
              </p>
            </div>

            {/* CTA Buttons Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Create NFT CTA */}
              <div className="group relative">
                {/* Animated Background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all duration-500" />
                
                {/* Button Content */}
                <button
                  onClick={handleCreateNFT}
                  className="relative w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 group-hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                      <div className="relative bg-white/10 p-4 rounded-full">
                        <Palette className="w-8 h-8" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Create Dynamic NFT</h3>
                      <p className="text-blue-100 mb-4">
                        Launch your first Live Art NFT with real-time data integration
                      </p>
                      
                      <div className="flex items-center justify-center space-x-2 text-sm font-medium">
                        <Zap className="w-4 h-4" />
                        <span>Start Creating</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Explore Marketplace CTA */}
              <div className="group relative">
                {/* Animated Background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all duration-500" />
                
                {/* Button Content */}
                <button
                  onClick={handleExploreMarketplace}
                  className="relative w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 group-hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                      <div className="relative bg-white/10 p-4 rounded-full">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Explore Marketplace</h3>
                      <p className="text-emerald-100 mb-4">
                        Discover and trade dynamic NFTs from creators worldwide
                      </p>
                      
                      <div className="flex items-center justify-center space-x-2 text-sm font-medium">
                        <TrendingUp className="w-4 h-4" />
                        <span>Browse Collection</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Explore All Button */}
              <button
                onClick={handleExploreAll}
                className="group flex items-center space-x-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/10 hover:border-white/20 text-white transition-all duration-300 hover:scale-105"
              >
                <span className="font-medium">Explore All NFTs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Or Divider */}
              <div className="hidden sm:block text-gray-400 font-medium">or</div>

              {/* Learn More Link */}
              <button
                onClick={() => navigate('/data-feeds')}
                className="group flex items-center space-x-2 px-8 py-4 text-gray-300 hover:text-white transition-colors duration-300"
              >
                <span className="font-medium">Learn about Data Feeds</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats Row */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-gray-400">Dynamic NFTs Created</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="text-gray-400">Active Creators</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-white">1M+</div>
                  <div className="text-gray-400">Real-time Updates</div>
                </div>
              </div>
            </div>

            {/* Bottom Description */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400 max-w-2xl mx-auto">
                Built on Sui blockchain for fast, secure, and low-cost transactions. 
                Experience the next generation of programmable NFTs today.
              </p>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="relative mt-8">
          {/* Floating Data Points */}
          <div className="absolute top-0 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-75" />
          <div className="absolute top-8 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
          <div className="absolute -top-4 right-1/4 w-4 h-4 bg-emerald-400 rounded-full animate-bounce opacity-50" />
          
          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-16 opacity-20" viewBox="0 0 400 64">
            <path
              d="M100,32 Q200,16 300,32"
              stroke="url(#gradient)"
              strokeWidth="1"
              fill="none"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;