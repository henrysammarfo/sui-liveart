import React, { useEffect, useState, useMemo } from 'react';
import type { LiveArtNFT } from '../../components/types';

interface NFTStateVisualizationProps {
  nft: LiveArtNFT;
  size?: 'small' | 'medium' | 'large';
  showTransformations?: boolean;
  className?: string;
}

interface VisualState {
  color: string;
  shadowColor: string;
  scale: number;
  rotation: number;
  brightness: number;
  blur: number;
  animationSpeed: number;
}

const NFTStateVisualization: React.FC<NFTStateVisualizationProps> = ({
  nft,
  size = 'medium',
  showTransformations = true,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update animation frame
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 50); // 20 FPS for smooth animations

    return () => clearInterval(interval);
  }, []);

  // Calculate visual state based on NFT data
  const visualState = useMemo((): VisualState => {
    const { market_value, volatility, trend } = nft;
    
    // Base colors based on trend
    const baseColors = {
      bullish: '#10b981', // Green
      bearish: '#ef4444', // Red
      neutral: '#8b5cf6'  // Purple
    };

    // Volatility affects animation and effects
    const volatilityMultiplier = {
      low: 0.5,
      medium: 1.0,
      high: 1.8
    }[volatility];

    // Market value affects scale and brightness
    const valueScale = Math.min(1.2, Math.max(0.8, market_value / 100));
    const brightness = Math.min(1.5, Math.max(0.7, market_value / 80));

    return {
      color: baseColors[trend],
      shadowColor: `${baseColors[trend]}40`,
      scale: valueScale,
      rotation: (currentTime * volatilityMultiplier * 0.01) % 360,
      brightness,
      blur: volatility === 'high' ? 2 : 0,
      animationSpeed: volatilityMultiplier
    };
  }, [nft, currentTime]);

  // Size configurations
  const sizeConfig = {
    small: { container: 'w-20 h-20', image: 'w-16 h-16' },
    medium: { container: 'w-32 h-32', image: 'w-28 h-28' },
    large: { container: 'w-48 h-48', image: 'w-44 h-44' }
  };

  const config = sizeConfig[size];

  // Dynamic styles
  const containerStyle = {
    transform: `scale(${visualState.scale}) rotate(${showTransformations ? visualState.rotation : 0}deg)`,
    filter: `brightness(${visualState.brightness}) blur(${visualState.blur}px)`,
    boxShadow: `0 0 ${20 * visualState.scale}px ${visualState.shadowColor}`,
    transition: showTransformations ? 'none' : 'all 0.3s ease',
  };

  const overlayStyle = {
    background: `linear-gradient(45deg, ${visualState.color}20, transparent, ${visualState.color}10)`,
    animation: showTransformations ? `pulse ${2 / visualState.animationSpeed}s infinite` : 'none',
  };

  return (
    <div className={`relative ${config.container} ${className}`}>
      {/* Main NFT Container */}
      <div
        className="relative w-full h-full rounded-xl overflow-hidden border border-white/10"
        style={containerStyle}
      >
        {/* Base NFT Image */}
        <img
          src={nft.image_url}
          alt={nft.name}
          className={`${config.image} object-cover rounded-lg mx-auto mt-2`}
          loading="lazy"
        />

        {/* Dynamic Color Overlay */}
        <div
          className="absolute inset-0 rounded-xl mix-blend-overlay"
          style={overlayStyle}
        />

        {/* Trend Indicator */}
        <div className="absolute top-2 right-2">
          <div
            className={`w-3 h-3 rounded-full ${
              nft.trend === 'bullish' 
                ? 'bg-green-400' 
                : nft.trend === 'bearish' 
                ? 'bg-red-400' 
                : 'bg-purple-400'
            }`}
            style={{
              boxShadow: `0 0 10px ${visualState.color}`,
              animation: showTransformations ? 'ping 2s infinite' : 'none'
            }}
          />
        </div>

        {/* Volatility Indicator */}
        {nft.volatility === 'high' && showTransformations && (
          <div className="absolute inset-0 border-2 border-yellow-400/50 rounded-xl animate-pulse" />
        )}
      </div>

      {/* Data Display Overlay */}
      {showTransformations && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white border border-white/20">
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">$</span>
              <span className="font-mono">{nft.market_value.toFixed(2)}</span>
              <div
                className={`w-2 h-2 rounded-full ${
                  nft.trend === 'bullish' ? 'bg-green-400' :
                  nft.trend === 'bearish' ? 'bg-red-400' : 'bg-gray-400'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Real-time Update Indicator */}
      {showTransformations && Date.now() - nft.last_updated < 10000 && (
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
          <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full" />
        </div>
      )}
    </div>
  );
};

// Animation keyframes (add to your global CSS)
// @keyframes pulse {
//   0%, 100% { opacity: 0.5; }
//   50% { opacity: 0.8; }
// }
//
// @keyframes ping {
//   0% { transform: scale(1); opacity: 1; }
//   75%, 100% { transform: scale(2); opacity: 0; }
// }

export default NFTStateVisualization;