// If useNfts is a default export:
import { useNfts } from '../../context/NftContext'
// Or, if the correct named export is something else, adjust accordingly:
// import { NftContext } from '../../context/NftContext'
// Replace 'DynamicNFT' with the correct type or use 'any' if not defined
// import { DynamicNFT } from '../../types'
type DynamicNFT = {
  imageUrl: string;
  name: string;
  creator: string;
  currentState: string;
  currentPrice?: number;
  activeRule?: string;
  price: number;
};

interface NFTCardProps {
  nft: DynamicNFT
}

export const NFTCard = ({ nft }: NFTCardProps) => {
  const { refreshNfts } = useNfts()
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-sui-blue">
      <div className="relative">
        <img 
          src={nft.imageUrl} 
          alt={nft.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-sui-blue text-white px-2 py-1 rounded-full text-xs">
          {nft.currentState}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-sui-dark">{nft.name}</h3>
        <p className="text-gray-600 text-sm mt-1">by {nft.creator.slice(0,6)}...{nft.creator.slice(-4)}</p>
        
        <div className="mt-3">
          {nft.currentPrice && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Value:</span>
              <span className="font-bold">${nft.currentPrice.toFixed(2)}</span>
            </div>
          )}
          
          {nft.activeRule && (
            <div className="mt-2 bg-sui-light p-2 rounded text-xs">
              <span className="font-medium">Active Trigger:</span> {nft.activeRule}
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold text-sui-dark">{nft.price} SUI</span>
          <button 
            onClick={refreshNfts}
            className="text-sui-blue hover:text-blue-700 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}