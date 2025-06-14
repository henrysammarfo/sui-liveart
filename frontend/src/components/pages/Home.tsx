import React from 'react';
import HeroSection from '../home/HeroSection';
import FeaturesSection from '../home/FeaturesSection';
import NFTShowcase from '../home/NFTShowcase';
import CallToActionSection from '../home/CallToActionSection';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Geometric background patterns */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-purple-400/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-cyan-400/10 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border border-blue-400/10 rounded-full animate-pulse delay-1500"></div>
        
        {/* Gradient overlays */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <NFTShowcase />
        <CallToActionSection />
      </div>
    </div>
  );
};

export default Home;