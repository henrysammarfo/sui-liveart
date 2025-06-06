import React from 'react';
import HeroSection from '../home/HeroSection';
import FeaturesSection from '../home/FeaturesSection';
import NFTShowcase from '../home/NFTShowcase';
import CallToActionSection from '../home/CallToActionSection';

// =================== Home Page Component ===================

const Home: React.FC = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* NFT Showcase */}
      <NFTShowcase />
      
      {/* Call to Action */}
      <CallToActionSection />
    </div>
  );
};

export default Home;