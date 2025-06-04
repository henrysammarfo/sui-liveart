import { createContext, useEffect, useState, useMemo, useCallback } from 'react'
// Make sure DynamicNFT is exported from '../types', or import the correct type
// import { DynamicNFT } from '../types'
// import type { DynamicNFT } from '../types'
// TODO: Replace 'any' with the correct type or ensure 'DynamicNFT' is exported from '../types'
interface TransformationRule {
  condition: 'gt' | 'lt' | 'eq' | 'ne'
  threshold: number
  targetState: string
  description: string
}

interface DataFeed {
  source: string
  feedId: string
}

interface DynamicNFT {
  id: string
  name: string
  creator: string
  currentState: string
  imageUrl: string
  dataFeed: DataFeed
  transformations: TransformationRule[]
  price: number
  currentPrice?: number
  activeRule?: string
}
import { PythClient } from '../utils/pythClient'

interface NftContextType {
  nfts: DynamicNFT[]
  refreshNfts: () => void
}

const NftContext = createContext<NftContextType | null>(null)

export const NftProvider = ({ children }: { children: React.ReactNode }) => {
  const [nfts, setNfts] = useState<DynamicNFT[]>([])
  const pythClient = useMemo(() => new PythClient(), [])

  // import { useCallback } from 'react' // moved to top-level import

  const fetchNfts = useCallback(async () => {
    // Mock NFT data
    const mockNfts: DynamicNFT[] = [
      {
        id: '1',
        name: 'Quantum Shift',
        creator: '0xCreator1',
        currentState: 'base',
        imageUrl: 'https://placehold.co/400',
        dataFeed: {
          source: 'pyth',
          feedId: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // ETH/USD
        },
        transformations: [{
          condition: 'gt',
          threshold: 3000,
          targetState: 'bull-state',
          description: 'When ETH > $3,000'
        }],
        price: 100,
      },
      {
        id: '2',
        name: 'Bitcoin Horizon',
        creator: '0xCreator2',
        currentState: 'base',
        imageUrl: 'https://placehold.co/400',
        dataFeed: {
          source: 'pyth',
          feedId: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD
        },
        transformations: [{
          condition: 'gt',
          threshold: 50000,
          targetState: 'moon-state',
          description: 'When BTC > $50,000'
        }],
        price: 150,
      }
    ]

    // Fetch real prices for NFTs
    const updatedNfts = await Promise.all(mockNfts.map(async nft => {
      if (nft.dataFeed.source === 'pyth') {
        const priceRaw = await pythClient.getPrice(nft.dataFeed.feedId)
        const price = typeof priceRaw === 'number' ? priceRaw : Number(priceRaw)
        // Apply transformation rules
        const activeRule = nft.transformations.find(rule => {
          switch (rule.condition) {
            case 'gt': return price > rule.threshold
            case 'lt': return price < rule.threshold
            case 'eq': return price === rule.threshold
            case 'ne': return price !== rule.threshold
            default: return false
          }
        })
        
        return {
          ...nft,
          currentPrice: isNaN(price) ? undefined : price,
          currentState: activeRule?.targetState || nft.currentState,
          activeRule: activeRule?.description
        }
      }
      return nft
    }))

    setNfts(updatedNfts)
  }, [pythClient])

  useEffect(() => {
    fetchNfts()
    const interval = setInterval(fetchNfts, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [fetchNfts])

  return (
    <NftContext.Provider value={{ nfts, refreshNfts: fetchNfts }}>
      {children}
    </NftContext.Provider>
  )
}

// useNfts hook moved to a separate file: useNfts.ts