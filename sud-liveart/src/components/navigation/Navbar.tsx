import { ConnectWalletButton } from '@/components/wallet'
import { useNfts } from '@/context/NftContext'

export const Navbar = () => {
  const { refreshNfts } = useNfts()
  
  return (
    <nav className="bg-sui-dark text-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-10">
        <h1 className="text-xl font-bold text-sui-blue">LiveArt Sui</h1>
        <div className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-sui-blue">Home</a>
          <a href="/marketplace" className="hover:text-sui-blue">Marketplace</a>
          <a href="/creator" className="hover:text-sui-blue">Creator</a>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={refreshNfts}
          className="bg-sui-blue hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
        >
          Refresh Prices
        </button>
        <ConnectWalletButton />
      </div>
    </nav>
  )
}