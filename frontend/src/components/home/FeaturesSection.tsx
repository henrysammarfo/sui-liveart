import React from 'react';
import { Activity, Shield, Database, Clock, TrendingUp, Zap } from 'lucide-react';

// =================== Feature Data ===================

const features = [
  {
    icon: Activity,
    title: "Real-Time Transformations",
    description: "Your NFTs evolve instantly with market changes, sentiment shifts, and world events. Watch your digital art come alive with every data update.",
    highlights: [
      "Live market data integration",
      "Sentiment-based color changes",
      "Volatility-driven animations"
    ],
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "Sui Blockchain Security",
    description: "Built on Sui's high-performance blockchain with guaranteed security, fast transactions, and minimal gas fees for seamless NFT interactions.",
    highlights: [
      "Sub-second finality",
      "Low transaction costs",
      "Parallel execution"
    ],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Database,
    title: "Multiple Data Sources",
    description: "Connect to various data feeds including Pyth Network, market APIs, social sentiment, and custom oracles for unlimited creative possibilities.",
    highlights: [
      "Pyth Network integration",
      "Custom API connections",
      "Social sentiment analysis"
    ],
    gradient: "from-green-500 to-emerald-500"
  }
];

// =================== Features Section Component ===================

const FeaturesSection: React.FC = () => {
  return (
    <section className="relative py-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 border border-slate-600/50 text-slate-300 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Powered by Innovation
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why Choose
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Sui LiveArt?
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the future of digital art where your NFTs are no longer static images, 
            but living, breathing creations that respond to the world around them.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Card Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />
              
              {/* Feature Card */}
              <div className="relative h-full bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 hover:border-slate-500/70 transition-all duration-300">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} p-0.5 mb-6`}>
                  <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-3">
                  {feature.highlights.map((highlight, highlightIndex) => (
                    <li key={highlightIndex} className="flex items-center text-sm text-gray-400">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} mr-3`} />
                      {highlight}
                    </li>
                  ))}
                </ul>

                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" style={{
                  backgroundImage: `linear-gradient(to right, ${feature.gradient.split(' ')[1]}, ${feature.gradient.split(' ')[3]})`
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 pt-12 border-t border-slate-700/50">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-purple-400 mr-2" />
                <span className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors">
                  &lt;1s
                </span>
              </div>
              <p className="text-gray-400 text-sm">Update Speed</p>
            </div>
            
            <div className="group">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-blue-400 mr-2" />
                <span className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  24/7
                </span>
              </div>
              <p className="text-gray-400 text-sm">Live Monitoring</p>
            </div>
            
            <div className="group">
              <div className="flex items-center justify-center mb-3">
                <Database className="w-6 h-6 text-green-400 mr-2" />
                <span className="text-3xl font-bold text-white group-hover:text-green-400 transition-colors">
                  50+
                </span>
              </div>
              <p className="text-gray-400 text-sm">Data Sources</p>
            </div>
            
            <div className="group">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-cyan-400 mr-2" />
                <span className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  100%
                </span>
              </div>
              <p className="text-gray-400 text-sm">Secure</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;