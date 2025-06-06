import React, { useState } from 'react';
import { 
  useCurrentWallet, 
  useConnectWallet, 
  useDisconnectWallet,
  useSuiClientQuery,
  useCurrentAccount
} from '@mysten/dapp-kit';
import { Wallet, LogOut, Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

// =================== Utility Functions ===================

const formatAddress = (address: string, start = 6, end = 4): string => {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

const formatSuiAmount = (amount: bigint | string | number): string => {
  const amountStr = amount.toString();
  const suiAmount = Number(amountStr) / 1_000_000_000; // Convert MIST to SUI
  return suiAmount.toFixed(4);
};

// =================== Wallet Dropdown Component ===================

interface WalletDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  balance: string;
  onDisconnect: () => void;
}

const WalletDropdown: React.FC<WalletDropdownProps> = ({
  isOpen,
  onClose,
  address,
  balance,
  onDisconnect,
}) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy address');
    }
  };

  const viewOnExplorer = () => {
    const explorerUrl = `https://testnet.suivision.xyz/account/${address}`;
    window.open(explorerUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown Menu */}
      <div className="absolute right-0 top-full mt-2 w-72 bg-slate-800/95 backdrop-blur-lg rounded-xl border border-slate-700/50 shadow-xl z-50">
        <div className="p-4 space-y-4">
          
          {/* Account Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Account</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={copyAddress}
                  className="p-1 rounded-md hover:bg-slate-700/50 transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                <button
                  onClick={viewOnExplorer}
                  className="p-1 rounded-md hover:bg-slate-700/50 transition-colors"
                  title="View on explorer"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="text-white font-mono text-sm">
              {formatAddress(address, 8, 6)}
            </div>
          </div>

          {/* Balance */}
          <div className="space-y-2">
            <span className="text-sm text-slate-400">Balance</span>
            <div className="text-white font-medium">
              {balance} SUI
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700/50" />

          {/* Actions */}
          <button
            onClick={onDisconnect}
            className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      </div>
    </>
  );
};

// =================== Main Connect Wallet Component ===================

const ConnectWallet: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { currentWallet } = useCurrentWallet();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const currentAccount = useCurrentAccount();

  // Get balance
  const { data: balance } = useSuiClientQuery(
    'getBalance',
    {
      owner: currentAccount?.address || '',
    },
    {
      enabled: !!currentAccount?.address,
    }
  );

  const isConnected = !!currentWallet && !!currentAccount;
  const formattedBalance = balance ? formatSuiAmount(balance.totalBalance) : '0.0000';

  const handleConnect = () => {
    if (!currentWallet) {
      toast.error('No wallet selected');
      return;
    }
    connect(
      { wallet: currentWallet },
      {
        onSuccess: () => {
          toast.success('Wallet connected successfully!');
        },
        onError: (error) => {
          console.error('Wallet connection error:', error);
          toast.error('Failed to connect wallet');
        },
      }
    );
  };

  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
    toast.success('Wallet disconnected');
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        className="
          flex items-center space-x-2 px-4 py-2 
          bg-gradient-to-r from-purple-600 to-blue-600 
          hover:from-purple-700 hover:to-blue-700
          text-white font-medium rounded-lg 
          transition-all duration-200 
          hover:shadow-lg hover:shadow-purple-500/25
          hover:scale-105
        "
      >
        <Wallet className="w-4 h-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="
          flex items-center space-x-2 px-4 py-2 
          bg-slate-800/50 border border-slate-700/50
          hover:bg-slate-700/50 hover:border-slate-600/50
          text-white rounded-lg 
          transition-all duration-200
        "
      >
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="font-mono text-sm">
          {formatAddress(currentAccount?.address || '')}
        </span>
        <span className="text-xs text-slate-400">
          {formattedBalance} SUI
        </span>
      </button>

      <WalletDropdown
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        address={currentAccount?.address || ''}
        balance={formattedBalance}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
};

export default ConnectWallet;