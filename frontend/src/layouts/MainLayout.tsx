import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl } from '@mysten/sui/client';
import { Toaster } from 'react-hot-toast';

// Import your context
import { NftProvider } from '../context/NftContext';

// Import pages (these will be created next)
import Home from '../components/pages/Home';
import Explore from '../components/pages/Explore';
import Creator from '../components/pages/Creator';
import Marketplace from '../components/pages/Marketplace';
import DataFeeds from '../components/pages/DataFeeds';
import NFTDetail from '../components/pages/NFTDetail';

// Import navigation components (to be created)
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';

// =================== Configuration ===================

const queryClient = new QueryClient();

const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
};

const DEFAULT_NETWORK = 'testnet';

// =================== Main Layout Component ===================

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.02&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-purple-500/10 via-transparent to-transparent animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-blue-500/10 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
      </div>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #475569',
            borderRadius: '0.75rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f1f5f9',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f1f5f9',
            },
          },
        }}
      />
    </div>
  );
};

// =================== App Router Component ===================

const AppRouter: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />
          
          {/* Explore NFTs */}
          <Route path="/explore" element={<Explore />} />
          
          {/* Creator Studio */}
          <Route path="/creator" element={<Creator />} />
          
          {/* Marketplace */}
          <Route path="/marketplace" element={<Marketplace />} />
          
          {/* Data Feeds */}
          <Route path="/data-feeds" element={<DataFeeds />} />
          
          {/* NFT Detail Page */}
          <Route path="/nft/:id" element={<NFTDetail />} />
          
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

// =================== Root App Component ===================

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork={DEFAULT_NETWORK}>
        <WalletProvider autoConnect>
          <NftProvider>
            <AppRouter />
          </NftProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default App;