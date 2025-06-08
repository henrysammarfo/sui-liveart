import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  DollarSign, 
  Tag, 
  Trash2, 
  Edit3, 
  Heart, 
  Share2, 
  AlertCircle, 
  Check, 
  Loader2,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  Info
} from 'lucide-react';
import type { LiveArtNFT } from '../types';

interface MarketplaceActionsProps {
  nft: LiveArtNFT;
  currentUserAddress?: string;
  onPurchase?: (nftId: string, price: number) => Promise<void>;
  onList?: (nftId: string, price: number) => Promise<void>;
  onDelist?: (nftId: string) => Promise<void>;
  onMakeOffer?: (nftId: string, offer: number) => Promise<void>;
  onUpdatePrice?: (nftId: string, newPrice: number) => Promise<void>;
}

interface Offer {
  id: string;
  bidder: string;
  amount: number;
  expires_at: number;
  created_at: number;
}

interface TransactionState {
  type: 'purchase' | 'list' | 'delist' | 'offer' | 'update_price' | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const MarketplaceActions: React.FC<MarketplaceActionsProps> = ({
  nft,
  currentUserAddress = "0x1234...5678",
  onPurchase,
  onList,
  onDelist,
  onMakeOffer,
  onUpdatePrice
}) => {
  const [showListModal, setShowListModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showUpdatePriceModal, setShowUpdatePriceModal] = useState(false);
  const [listPrice, setListPrice] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [newPrice, setNewPrice] = useState(nft.list_price?.toString() || '');
  const [transaction, setTransaction] = useState<TransactionState>({
    type: null,
    loading: false,
    error: null,
    success: false
  });

  // Mock offers data - Replace with actual data fetching
  const [offers] = useState<Offer[]>([
    {
      id: '1',
      bidder: '0xabcd...efgh',
      amount: 2.2,
      expires_at: Date.now() + 86400000,
      created_at: Date.now() - 3600000
    },
    {
      id: '2',
      bidder: '0xijkl...mnop',
      amount: 2.0,
      expires_at: Date.now() + 172800000,
      created_at: Date.now() - 7200000
    }
  ]);

  const isOwner = nft.owner === currentUserAddress;
  const isListed = nft.is_listed;

  const formatAddress = (address: string) => 
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  const formatExpiration = (expiresAt: number) => {
    const hours = Math.floor((expiresAt - Date.now()) / 3600000);
    return hours > 24 
      ? `${Math.floor(hours / 24)} days` 
      : `${hours} hours`;
  };

  const handleAction = async (
    action: () => Promise<void>,
    type: TransactionState['type']
  ) => {
    setTransaction({
      type,
      loading: true,
      error: null,
      success: false
    });

    try {
      await action();
      setTransaction({
        type,
        loading: false,
        error: null,
        success: true
      });
      
      // Reset modals on success
      setShowListModal(false);
      setShowOfferModal(false);
      setShowUpdatePriceModal(false);
      
      // Reset success state after delay
      setTimeout(() => {
        setTransaction(prev => ({ ...prev, success: false }));
      }, 3000);
    } catch (err: unknown) {
      let errorMessage = 'Transaction failed';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setTransaction({
        type,
        loading: false,
        error: errorMessage,
        success: false
      });
    }
  };

  const handlePurchase = () => {
    if (typeof nft.list_price !== 'number') return;
    handleAction(async () => onPurchase?.(nft.id, nft.list_price as number), 'purchase');
  };

  const handleList = () => {
    const price = parseFloat(listPrice);
    if (isNaN(price)) return;
    handleAction(async () => onList?.(nft.id, price), 'list');
  };

  const handleDelist = () => {
    handleAction(async () => onDelist?.(nft.id), 'delist');
  };

  const handleMakeOffer = () => {
    const amount = parseFloat(offerAmount);
    if (isNaN(amount)) return;
    handleAction(async () => onMakeOffer?.(nft.id, amount), 'offer');
  };

  const handleUpdatePrice = () => {
    const price = parseFloat(newPrice);
    if (isNaN(price)) return;
    handleAction(async () => onUpdatePrice?.(nft.id, price), 'update_price');
  };

  // Reset modals when closed
  useEffect(() => {
    if (!showListModal) setListPrice('');
    if (!showOfferModal) setOfferAmount('');
    if (!showUpdatePriceModal) setNewPrice(nft.list_price?.toString() || '');
  }, [showListModal, showOfferModal, showUpdatePriceModal, nft.list_price]);

  return (
    <div className="space-y-6">
      {/* Transaction Status Indicators */}
      {transaction.loading && (
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          <div>
            <h3 className="font-semibold text-white">Processing Transaction</h3>
            <p className="text-sm text-blue-300">
              {transaction.type === 'purchase' && 'Purchasing NFT...'}
              {transaction.type === 'list' && 'Listing NFT...'}
              {transaction.type === 'delist' && 'Delisting NFT...'}
              {transaction.type === 'offer' && 'Submitting offer...'}
              {transaction.type === 'update_price' && 'Updating price...'}
            </p>
          </div>
        </div>
      )}

      {transaction.success && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-center gap-3">
          <Check className="w-6 h-6 text-green-400" />
          <div>
            <h3 className="font-semibold text-white">Transaction Successful!</h3>
            <p className="text-sm text-green-300">
              {transaction.type === 'purchase' && 'NFT purchased successfully'}
              {transaction.type === 'list' && 'NFT listed for sale'}
              {transaction.type === 'delist' && 'NFT delisted successfully'}
              {transaction.type === 'offer' && 'Offer submitted successfully'}
              {transaction.type === 'update_price' && 'Price updated successfully'}
            </p>
          </div>
        </div>
      )}

      {transaction.error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <div>
            <h3 className="font-semibold text-white">Transaction Failed</h3>
            <p className="text-sm text-red-300">{transaction.error}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isOwner ? (
          isListed ? (
            <>
              <button
                onClick={() => setShowUpdatePriceModal(true)}
                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <Edit3 className="w-6 h-6" />
                <span>Update Price</span>
              </button>
              <button
                onClick={handleDelist}
                disabled={transaction.loading}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-6 h-6" />
                <span>Delist NFT</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowListModal(true)}
              disabled={transaction.loading}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors col-span-full"
            >
              <Tag className="w-6 h-6" />
              <span>List NFT for Sale</span>
            </button>
          )
        ) : (
          isListed ? (
            <button
              onClick={handlePurchase}
              disabled={transaction.loading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] col-span-full"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="font-semibold">Buy Now for {nft.list_price} SUI</span>
            </button>
          ) : (
            <button
              onClick={() => setShowOfferModal(true)}
              disabled={transaction.loading}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors col-span-full"
            >
              <DollarSign className="w-6 h-6" />
              <span>Make an Offer</span>
            </button>
          )
        )}
      </div>

      {/* Additional Actions */}
      <div className="flex gap-2">
        <button className="flex-1 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-xl p-3 flex items-center justify-center gap-2">
          <Heart className="w-5 h-5" />
          <span>Favorite</span>
        </button>
        <button className="flex-1 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-xl p-3 flex items-center justify-center gap-2">
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Market Data */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">Market Data</h3>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            nft.trend === 'bullish' 
              ? 'bg-green-500/20 text-green-400' 
              : nft.trend === 'bearish' 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-gray-500/20 text-gray-400'
          }`}>
            {nft.trend === 'bullish' ? (
              <TrendingUp className="w-3 h-3" />
            ) : nft.trend === 'bearish' ? (
              <TrendingDown className="w-3 h-3" />
            ) : null}
            {nft.trend}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="text-gray-400">Sentiment:</div>
            <div className="font-medium">{nft.sentiment_score}/10</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-gray-400">Volatility:</div>
            <div className={`font-medium ${
              nft.volatility === 'high' ? 'text-red-400' : 
              nft.volatility === 'medium' ? 'text-yellow-400' : 
              'text-green-400'
            }`}>
              {nft.volatility}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-gray-400">Last Updated:</div>
            <div className="font-medium">2 hours ago</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-gray-400">Transformations:</div>
            <div className="font-medium">234</div>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      {offers.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
          <h3 className="font-semibold text-white mb-3">Current Offers</h3>
          <div className="space-y-3">
            {offers.map(offer => (
              <div key={offer.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{offer.amount} SUI</div>
                    <div className="text-xs text-gray-400">
                      by {formatAddress(offer.bidder)}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Expires in {formatExpiration(offer.expires_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Note */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <span className="font-medium text-white">Secure Transaction:</span> 
            {' '}All transactions are executed directly on the Sui blockchain. 
            Your assets are never held by intermediaries.
          </div>
        </div>
      </div>

      {/* List NFT Modal */}
      {showListModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">List NFT for Sale</h3>
              <button 
                onClick={() => setShowListModal(false)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-300 text-sm">Listing Price (SUI)</label>
                <div className="text-xs text-gray-400">Current floor: 2.1 SUI</div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  placeholder="Enter price"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            
            <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Service Fee (2%)</span>
                <span className="text-gray-300">+{listPrice ? (parseFloat(listPrice) * 0.02).toFixed(2) : '0.00'} SUI</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">You'll receive</span>
                <span className="font-semibold text-white">
                  {listPrice ? (parseFloat(listPrice) * 0.98).toFixed(2) : '0.00'} SUI
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowListModal(false)}
                className="flex-1 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-lg py-3"
              >
                Cancel
              </button>
              <button
                onClick={handleList}
                disabled={!listPrice || transaction.loading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg py-3 font-medium disabled:opacity-50 transition-all"
              >
                {transaction.loading && transaction.type === 'list' ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : 'Confirm Listing'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Make Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Make an Offer</h3>
              <button 
                onClick={() => setShowOfferModal(false)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-300 text-sm">Offer Amount (SUI)</label>
                <div className="text-xs text-gray-400">Min: 0.1 SUI</div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            
            <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <p>
                  This offer will be valid for 7 days. If accepted, the NFT will be transferred 
                  to you and the funds will be sent to the owner.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-lg py-3"
              >
                Cancel
              </button>
              <button
                onClick={handleMakeOffer}
                disabled={!offerAmount || transaction.loading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg py-3 font-medium disabled:opacity-50 transition-all"
              >
                {transaction.loading && transaction.type === 'offer' ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : 'Submit Offer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Price Modal */}
      {showUpdatePriceModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Update Listing Price</h3>
              <button 
                onClick={() => setShowUpdatePriceModal(false)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-300 text-sm">New Price (SUI)</label>
                <div className="text-xs text-gray-400">
                  Current: {nft.list_price} SUI
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Enter new price"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            
            <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Previous Price</span>
                <span className="text-gray-300">{nft.list_price} SUI</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Price Change</span>
                <span className={`font-medium ${
                  parseFloat(newPrice) > Number(nft.list_price || 0) 
                    ? 'text-green-400' 
                    : parseFloat(newPrice) < Number(nft.list_price || 0) 
                      ? 'text-red-400' 
                      : 'text-gray-300'
                }`}>
                  {newPrice && nft.list_price 
                    ? `${(parseFloat(newPrice) - Number(nft.list_price)).toFixed(2)} SUI` 
                    : '0.00 SUI'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpdatePriceModal(false)}
                className="flex-1 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-lg py-3"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePrice}
                disabled={!newPrice || transaction.loading || parseFloat(newPrice) === nft.list_price}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg py-3 font-medium disabled:opacity-50 transition-all"
              >
                {transaction.loading && transaction.type === 'update_price' ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : 'Update Price'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceActions;