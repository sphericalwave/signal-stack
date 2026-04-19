import { altcoins, zscoreIndicators } from '../data/mockData';
import SignalBadge from '../components/SignalBadge';

function Sparkline({ data }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const isUp = data[data.length - 1] >= data[0];
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={isUp ? '#22c55e' : '#f87171'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CoinCard({ ticker, data }) {
  const isUp = data.change24h >= 0;
  return (
    <div className="bg-[#111318] border border-white/10 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-white">{ticker}</span>
          <SignalBadge signal={data.signal} />
        </div>
        <Sparkline data={data.sparkline} />
      </div>
      <div className="flex items-end gap-3">
        <span className="font-mono text-xl font-semibold text-white">
          ${data.price.toLocaleString()}
        </span>
        <span className={`font-mono text-sm font-semibold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
          {isUp ? '+' : ''}{data.change24h}%
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div>
          <span className="text-slate-500">RSI 1W</span>
          <span className="font-mono text-slate-200 ml-2">{data.rsi1w}</span>
        </div>
        {data.mvrv  && <div><span className="text-slate-500">MVRV</span><span className="font-mono text-slate-200 ml-2">{data.mvrv}</span></div>}
        {data.ethbtc && <div><span className="text-slate-500">ETH/BTC</span><span className="font-mono text-slate-200 ml-2">{data.ethbtc}</span></div>}
        {data.tps   && <div><span className="text-slate-500">TPS</span><span className="font-mono text-slate-200 ml-2">{data.tps.toLocaleString()}</span></div>}
        {data.perpVol && <div><span className="text-slate-500">Perp Vol</span><span className="font-mono text-slate-200 ml-2">${data.perpVol}</span></div>}
      </div>
    </div>
  );
}

export default function Altcoins() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-base font-semibold text-white">Altcoin Watchlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {Object.entries(altcoins).map(([ticker, data]) => (
          <CoinCard key={ticker} ticker={ticker} data={data} />
        ))}
      </div>
      <div className="bg-[#111318] border border-white/10 rounded-lg p-4 min-h-48 flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-300">Z-Score Comparison Table</span>
        <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-md">
          <span className="text-[11px] text-slate-600 font-mono">[ Cross-coin z-score table — next session ]</span>
        </div>
      </div>
    </div>
  );
}
