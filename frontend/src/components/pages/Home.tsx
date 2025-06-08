import React from 'react';
import HeroSection from '../home/HeroSection';
import FeaturesSection from '../home/FeaturesSection';
import NFTShowcase from '../home/NFTShowcase';
import CallToActionSection from '../home/CallToActionSection';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
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