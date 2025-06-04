import { MainLayout } from '@/layouts/MainLayout'
import { useNfts } from '@/context/NftContext'
// Update the import path to the correct location of NFTCard
import { NFTCard } from '@/components/marketplace/NFTCard'

export default function Marketplace() {
  const { nfts } = useNfts()

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-sui-dark mb-8">Sui Dynamic NFT Marketplace</h1>
        
        {nfts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading dynamic NFTs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map(nft => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}