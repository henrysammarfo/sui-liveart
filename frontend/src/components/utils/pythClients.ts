import { PythHttpClient, PythConnection, getPythProgramKeyForCluster } from '@pythnetwork/client';
import { Connection as SolanaConnection, PublicKey } from '@solana/web3.js';

// Supported cluster options
type Cluster = 'devnet' | 'mainnet-beta';
const CLUSTER: Cluster = 'devnet';

// Solana RPC endpoints
const RPC_ENDPOINTS: Record<Cluster, string> = {
  devnet: 'https://api.devnet.solana.com',
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
};

// Pyth program key helper
function getProgramKey(cluster: Cluster): PublicKey {
  const rawKey = getPythProgramKeyForCluster(cluster);
  return new PublicKey(rawKey.toString());
}

// Price feed symbols
export type FeedSymbol = 'BTC/USD' | 'ETH/USD';
const FEED_IDS: Record<FeedSymbol, string> = {
  'BTC/USD': '8B1zL6TfpFYQaUwQ1b9zGLJj4xwzwcoLzxuZaBRtpQWb',
  'ETH/USD': '7dFYrAX3w7Ude3RmPvhLFm8zLSvjjoGjQbdqdfgxoM6a',
};

const RPC_URL = RPC_ENDPOINTS[CLUSTER];
const PROGRAM_KEY = getProgramKey(CLUSTER);

// PublicKeys for feeds
const FEED_KEYS: Record<FeedSymbol, PublicKey> = Object.fromEntries(
  Object.entries(FEED_IDS).map(([symbol, id]) => [symbol, new PublicKey(id)])
) as Record<FeedSymbol, PublicKey>;

let httpClient: PythHttpClient;
let wsConnection: PythConnection;

/**
 * Initialize HTTP & WS Pyth clients
 */
export async function initPythClients(): Promise<void> {
  if (!httpClient) {
    const sol = new SolanaConnection(RPC_URL);
    httpClient = new PythHttpClient(sol, PROGRAM_KEY);
  }
  if (!wsConnection) {
    const sol = new SolanaConnection(RPC_URL);
    wsConnection = new PythConnection(sol, PROGRAM_KEY);
    await wsConnection.start();
  }
}

interface HTTPFeed { productAccountKey: string; price: { price: number } }

/**
 * Fetch snapshot price via HTTP
 */
export async function fetchCurrentPrice(symbol: FeedSymbol): Promise<number | null> {
  if (!httpClient) throw new Error('initPythClients() not called');
  const feeds = await httpClient.getData();
  const list = Array.isArray(feeds) ? (feeds as HTTPFeed[]) : [];
  const key = FEED_KEYS[symbol].toBase58();
  const acct = list.find(a => a.productAccountKey === key);
  return acct?.price.price ?? null;
}

/**
 * Subscribe to live price updates via WS
 */
export function subscribePrice(
  symbol: FeedSymbol,
  onUpdate: (price: number) => void
): () => void {
  if (!wsConnection) throw new Error('initPythClients() not called');
  const key = FEED_KEYS[symbol].toBase58();

  const listener = (data: unknown) => {
    const { productAccountKey, price } = data as {
      productAccountKey?: string;
      price?: { price?: number };
    };
    if (productAccountKey === key && price?.price != null) {
      onUpdate(price.price);
    }
  };

  wsConnection.onPriceChange(listener);

  return () => {};
}
