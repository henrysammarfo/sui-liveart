import React, { useEffect, useState } from 'react';
import type { FeedSymbol } from '../utils/pythClients';
import { initPythClients, fetchCurrentPrice, subscribePrice } from '../utils/pythClients';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { TrendingUp, Zap, Circle } from 'lucide-react';

interface DataFeedCardProps {
  symbol: FeedSymbol;
  icon: React.ComponentType<{ className?: string }>;
}

const DataFeedCard: React.FC<DataFeedCardProps> = ({ symbol, icon: Icon }) => {
  const [price, setPrice] = useState<number | null>(null);
  const [history, setHistory] = useState<{ time: string; value: number }[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    let unsubscribe: () => void;
    let intervalId: NodeJS.Timeout;

    async function setup() {
      try {
        await initPythClients();
        setConnected(true);
        const snapshot = await fetchCurrentPrice(symbol);
        if (snapshot !== null) {
          setPrice(snapshot);
          setHistory([{ time: new Date().toLocaleTimeString(), value: snapshot }]);
        }

        unsubscribe = subscribePrice(symbol, (updatedPrice) => {
          setPrice(updatedPrice);
          setHistory((prev) => [
            ...prev.slice(-19),
            { time: new Date().toLocaleTimeString(), value: updatedPrice }
          ]);
        });

        intervalId = setInterval(async () => {
          const snap = await fetchCurrentPrice(symbol);
          if (snap !== null) {
            setPrice(snap);
            setHistory((prev) => [
              ...prev.slice(-19),
              { time: new Date().toLocaleTimeString(), value: snap }
            ]);
          }
        }, 30000);
      } catch {
        setConnected(false);
      }
    }

    setup();

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(intervalId);
    };
  }, [symbol]);

  return (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-2">
        <Icon className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">{symbol}</h3>
        <Circle className={`w-3 h-3 ${connected ? 'text-green-400' : 'text-red-400'}`} />
      </div>
      <div className="text-3xl font-semibold text-white">{price !== null ? price.toFixed(2) : '—'}</div>
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{ background: '#1f2937', border: 'none' }}
            itemStyle={{ color: '#fff' }}
            labelFormatter={(label: string | number) => String(label)}
          />
          <Area type="monotone" dataKey="value" stroke="transparent" fillOpacity={0.3} fill="url(#gradient)" />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400">Live Feed • Updated every 30s</p>
    </div>
  );
};

const DataFeeds: React.FC = () => {
  const feeds: { symbol: FeedSymbol; icon: React.ComponentType<{ className?: string }> }[] = [
    { symbol: 'BTC/USD', icon: TrendingUp },
    { symbol: 'ETH/USD', icon: Zap },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">Data Feeds</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {feeds.map(({ symbol, icon }) => (
            <DataFeedCard key={symbol} symbol={symbol} icon={icon} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DataFeeds;
