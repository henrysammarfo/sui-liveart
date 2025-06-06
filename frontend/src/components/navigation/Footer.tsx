import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Twitter, 
  Github, 
  // Discord, 
  ExternalLink,
  Mail,
  Globe
} from 'lucide-react';

// =================== Footer Links Data ===================

const footerSections = [
  {
    title: 'Platform',
    links: [
      { name: 'Explore NFTs', href: '/explore' },
      { name: 'Creator Studio', href: '/creator' },
      { name: 'Marketplace', href: '/marketplace' },
      { name: 'Data Feeds', href: '/data-feeds' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: '#', external: true },
      { name: 'API Reference', href: '#', external: true },
      { name: 'Tutorials', href: '#', external: true },
      { name: 'Support', href: '#', external: true },
    ],
  },
  {
    title: 'Community',
    links: [
      { name: 'Blog', href: '#', external: true },
      { name: 'Events', href: '#', external: true },
      { name: 'Partners', href: '#', external: true },
      { name: 'Brand Kit', href: '#', external: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Disclaimer', href: '#' },
    ],
  },
];

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
  // Replace with a generic icon or your own Discord SVG/icon component
  { name: 'Discord', icon: Globe, href: '#', color: 'hover:text-indigo-400' },
  { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-gray-300' },
  { name: 'Email', icon: Mail, href: 'mailto:hello@suiliveart.com', color: 'hover:text-green-400' },
];

// =================== Stats Component ===================

const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Active NFTs', value: '2,547' },
    { label: 'Total Volume', value: '145K SUI' },
    { label: 'Creators', value: '892' },
    { label: 'Data Updates/Day', value: '50K+' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="text-center p-4 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-purple-500/30 transition-all duration-300"
        >
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-slate-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

// =================== Newsletter Signup ===================

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Handle newsletter signup
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="mb-12">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Stay Updated</h3>
        <p className="text-slate-400 text-sm">
          Get the latest updates on dynamic NFTs and platform features
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex space-x-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="
              flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700/50 
              rounded-lg text-white placeholder-slate-400
              focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50
              transition-all duration-200
            "
          />
          <button
            type="submit"
            disabled={isSubscribed}
            className="
              px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 
              hover:from-purple-700 hover:to-blue-700
              disabled:opacity-50 disabled:cursor-not-allowed
              text-white font-medium rounded-lg 
              transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25
            "
          >
            {isSubscribed ? 'Subscribed!' : 'Subscribe'}
          </button>
        </div>
      </form>
    </div>
  );
};

// =================== Main Footer Component ===================

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-slate-900/50 border-t border-slate-700/50">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Stats Section */}
        <StatsSection />
        
        {/* Newsletter Signup */}
        <NewsletterSignup />
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Sui LiveArt
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              The first dynamic NFT marketplace on Sui blockchain. Create and trade 
              NFTs that evolve with real-world data, bringing art to life through 
              technology and innovation.
            </p>
            
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Globe className="w-4 h-4" />
              <span>Built on Sui Network</span>
            </div>
          </div>
          
          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-white font-medium">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-purple-300 text-sm transition-colors duration-200 flex items-center space-x-1"
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-slate-400 hover:text-purple-300 text-sm transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-700/50 space-y-4 md:space-y-0">
          
          {/* Copyright */}
          <div className="text-sm text-slate-400">
            © 2025 Sui LiveArt. All rights reserved.
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`
                  p-2 rounded-lg text-slate-400 transition-all duration-200
                  hover:bg-slate-800/50 ${social.color}
                `}
                title={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;