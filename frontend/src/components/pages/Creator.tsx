import React, { useState } from 'react';
import { Palette, Zap, BarChart3, Plus, Eye, Sparkles } from 'lucide-react';
import TriggerBuilder from '../creator/TriggerBuilder';
import CreatorDashboard from '../creator/CreatorDashboard';

const Creator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [nftForm, setNftForm] = useState({
    name: '',
    description: '',
    data_source: '',
    color_scheme: 'gradient-purple',
    animation_speed: 1.0,
    opacity: 1.0
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const { createNft } = useNftContext();

  const handleFormChange = (field: string, value: string | number) => {
    setNftForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateNft = async () => {
    if (!nftForm.name || !nftForm.description || !nftForm.data_source) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    try {
      await createNft({
        name: nftForm.name,
        description: nftForm.description,
        data_source: nftForm.data_source,
        color_scheme: nftForm.color_scheme,
        animation_speed: nftForm.animation_speed,
        opacity: nftForm.opacity
      });
      
      // Reset form
      setNftForm({
        name: '',
        description: '',
        data_source: '',
        color_scheme: 'gradient-purple',
        animation_speed: 1.0,
        opacity: 1.0
      });
      
      alert('NFT created successfully!');
    } catch (error) {
      console.error('Error creating NFT:', error);
      alert('Failed to create NFT');
    } finally {
      setIsCreating(false);
    }
  };

  const colorSchemes = [
    { value: 'gradient-purple', label: 'Purple Gradient', preview: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { value: 'gradient-blue', label: 'Blue Gradient', preview: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
    { value: 'gradient-green', label: 'Green Gradient', preview: 'bg-gradient-to-br from-green-500 to-emerald-500' },
    { value: 'gradient-fire', label: 'Fire Gradient', preview: 'bg-gradient-to-br from-orange-500 to-red-500' }
  ];

  const dataSources = [
    { value: 'crypto-market', label: 'Crypto Market Data', icon: '₿' },
    { value: 'stock-market', label: 'Stock Market Data', icon: '📈' },
    { value: 'weather', label: 'Weather Data', icon: '🌤️' },
    { value: 'social-sentiment', label: 'Social Sentiment', icon: '💬' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Creator Studio
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Build dynamic NFTs that transform based on real-world data
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'create'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create New NFT
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'manage'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Manage NFTs
            </button>
          </div>
        </div>

        {/* Create Tab Content */}
        {activeTab === 'create' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Creation Form */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Palette className="w-6 h-6 mr-2 text-purple-400" />
                  NFT Details
                </h2>

                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      NFT Name *
                    </label>
                    <input
                      type="text"
                      value={nftForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="Enter NFT name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    />
                  </div>

                  {/* Description Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={nftForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder="Describe your dynamic NFT"
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    />
                  </div>

                  {/* Data Source Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Data Source *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {dataSources.map((source) => (
                        <button
                          key={source.value}
                          onClick={() => handleFormChange('data_source', source.value)}
                          className={`p-4 rounded-lg border transition-all ${
                            nftForm.data_source === source.value
                              ? 'border-purple-400 bg-purple-400/20 text-white'
                              : 'border-white/20 bg-white/5 text-gray-300 hover:border-purple-400/50'
                          }`}
                        >
                          <div className="text-2xl mb-1">{source.icon}</div>
                          <div className="text-sm font-medium">{source.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Scheme Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Color Scheme
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {colorSchemes.map((scheme) => (
                        <button
                          key={scheme.value}
                          onClick={() => handleFormChange('color_scheme', scheme.value)}
                          className={`p-3 rounded-lg border transition-all ${
                            nftForm.color_scheme === scheme.value
                              ? 'border-purple-400 bg-purple-400/20'
                              : 'border-white/20 bg-white/5 hover:border-purple-400/50'
                          }`}
                        >
                          <div className={`w-full h-8 rounded mb-2 ${scheme.preview}`}></div>
                          <div className="text-sm text-gray-300">{scheme.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Animation Speed */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Animation Speed: {nftForm.animation_speed}x
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="3.0"
                      step="0.1"
                      value={nftForm.animation_speed}
                      onChange={(e) => handleFormChange('animation_speed', parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Opacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Opacity: {Math.round(nftForm.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.1"
                      value={nftForm.opacity}
                      onChange={(e) => handleFormChange('opacity', parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Eye className="w-6 h-6 mr-2 text-purple-400" />
                  Live Preview
                </h2>

                {/* NFT Preview */}
                <div className="aspect-square bg-white/5 rounded-xl border border-white/20 mb-6 flex items-center justify-center relative overflow-hidden">
                  {nftForm.name ? (
                    <div 
                      className={`w-full h-full ${colorSchemes.find(s => s.value === nftForm.color_scheme)?.preview || 'bg-gradient-to-br from-purple-500 to-pink-500'} flex items-center justify-center`}
                      style={{ 
                        opacity: nftForm.opacity,
                        animation: `pulse ${2 / nftForm.animation_speed}s infinite`
                      }}
                    >
                      <div className="text-center text-white">
                        <Sparkles className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-xl font-bold">{nftForm.name}</h3>
                        <p className="text-sm opacity-80 mt-2">{nftForm.data_source.replace('-', ' ').toUpperCase()}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Preview will appear here</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-colors"
                  >
                    {showPreview ? 'Hide' : 'Show'} Advanced Preview
                  </button>
                  
                  <button
                    onClick={handleCreateNft}
                    disabled={!nftForm.name || !nftForm.description || !nftForm.data_source || isCreating}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all shadow-lg hover:shadow-xl"
                  >
                    {isCreating ? 'Creating...' : 'Create NFT'}
                  </button>
                </div>
              </div>
            </div>

            {/* Trigger Builder Section */}
            {showPreview && (
              <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-purple-400" />
                  Data Triggers
                </h2>
                <TriggerBuilder />
              </div>
            )}
          </div>
        )}

        {/* Manage Tab Content */}
        {activeTab === 'manage' && (
          <div className="max-w-7xl mx-auto">
            <CreatorDashboard />
          </div>
        )}
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3);
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default Creator;

type CreateNftParams = {
  name: string;
  description: string;
  data_source: string;
  color_scheme: string;
  animation_speed: number;
  opacity: number;
};

function useNftContext(): { createNft: (params: CreateNftParams) => Promise<void>; } {
    throw new Error('Function not implemented.');
}
