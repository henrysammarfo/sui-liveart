import { SuiPriceServiceConnection } from "@pythnetwork/pyth-sui-js"

export const PYTH_ENDPOINT = "https://hermes.pyth.network"

export class PythClient {
  private suiConnection: SuiPriceServiceConnection

  constructor() {
    this.suiConnection = new SuiPriceServiceConnection(PYTH_ENDPOINT)
  }

  async getPrice(feedId: string) {
    try {
      // Use the SuiPriceServiceConnection to get price
      const priceDataArray = await this.suiConnection.getLatestPriceFeeds([feedId])
      const priceData = priceDataArray?.[0]
      return priceData?.getPriceNoOlderThan(60)?.price || 0
    } catch (error) {
      console.error("Pyth price fetch error:", error)
      return 0
    }
  }

  async getSuiPriceObject() {
    try {
      // For on-chain interactions, use the Sui-specific connection
      return await this.suiConnection.getPriceFeedIds()
    } catch (error) {
      console.error("Error getting Sui price object:", error)
      return null
    }
  }
}

