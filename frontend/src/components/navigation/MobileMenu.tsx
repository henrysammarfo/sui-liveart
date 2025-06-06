import React from 'react';
import { Link } from 'react-router-dom';
import { X, Zap } from 'lucide-react';

// =================== Mobile Menu Types ===================

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * An array of navigation items to be displayed in the mobile menu.
   * Each item should include a name, href, and an optional icon component.
   */
  navigationItems: NavigationItem[];
  isActiveRoute: (path: string) => boolean;
}

// =================== Mobile Menu Component ===================

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navigationItems,
  isActiveRoute,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Slide-out Menu */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-lg border-l border-slate-700/50 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Sui LiveArt
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`
                group block w-full p-4 rounded-xl transition-all duration-300 transform
                hover:scale-105 hover:bg-slate-800/50
                ${isActiveRoute(item.href)
                  ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-300'
                  : 'text-slate-300 hover:text-white'
                }
              `}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isOpen ? 'slideInRight 0.3s ease-out forwards' : undefined,
              }}
            >
              <div className="flex items-center space-x-3">
                {item.icon && (
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
                    ${isActiveRoute(item.href)
                      ? 'bg-purple-500/20'
                      : 'bg-slate-800/50 group-hover:bg-slate-700/50'
                    }
                  `}>
                    <item.icon className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {getPageDescription(item.name)}
                  </div>
                </div>
              </div>
              
              {/* Active indicator */}
              {isActiveRoute(item.href) && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="text-center text-xs text-slate-400">
            <p>Dynamic NFTs • Real-Time Data</p>
            <p className="mt-1">Powered by Sui Blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// =================== Helper Functions ===================

const getPageDescription = (pageName: string): string => {
  const descriptions: Record<string, string> = {
    'Home': 'Welcome to dynamic NFTs',
    'Explore': 'Discover live artworks',
    'Creator Studio': 'Mint dynamic NFTs',
    'Marketplace': 'Trade and collect',
    'Data Feeds': 'Real-time data sources',
  };
  return descriptions[pageName] || '';
};

// =================== CSS Animation Styles ===================

// Add these styles to your global CSS or create a separate stylesheet

export default MobileMenu;