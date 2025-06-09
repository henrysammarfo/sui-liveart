import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NftProvider } from './context/NftContext';
import {MainLayout} from './layouts/MainLayout';
import Home from './components/pages/Home';
import Explore from './components/pages/Explore';
import Creator from './components/pages/Creator';
import Marketplace from './components/pages/Marketplace';
import NFTDetail from './components/pages/NFTDetail';
import DataFeeds from './components/pages/DataFeeds';
import './App.css';

function App() {
  return (
    <div className="App dark">
      <NftProvider>
        <Router>
          <div className="min-h-screen bg-slate-900 text-white">
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/creator" element={<Creator />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/nft/:id" element={<NFTDetail />} />
                <Route path="/data-feeds" element={<DataFeeds />} />
              </Routes>
            </MainLayout>
          </div>
        </Router>
      </NftProvider>
    </div>
  );
}

export default App;