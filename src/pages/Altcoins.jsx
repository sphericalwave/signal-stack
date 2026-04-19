import { useMarketData } from '../context/MarketDataContext';
import CoinCard from '../components/CoinCard';

const Z_METRICS = [
  { key: 'rsi',         label: 'RSI 1W' },
  { key: 'momentum',    label: '30d Momentum' },
  { key: 'onchain',     label: 'On-chain / Network' },
  { key: 'relStrength', label: 'Rel. Strength vs BTC' },
];

function zTextColor(v) {
  if (Math.abs(v) <= 0.5) return 'text-amber-400';
  return v > 0 ? 'text-green-400' : 'text-red-400';
}

function zBgColor(v) {
  if (Math.abs(v) <= 0.5) return 'bg-amber-400/10';
  return v > 0 ? 'bg-green-500/10' : 'bg-red-400/10';
}

export default function Altcoins() {
  const { data: { altcoins } } = useMarketData();
  const tickers = Object.keys(altcoins);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-base font-semibold text-white">Altcoin Watchlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {tickers.map((ticker) => (
          <CoinCard key={ticker} ticker={ticker} data={altcoins[ticker]} />
        ))}
      </div>

      <div className="bg-[#111318] border border-white/10 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
            Z-Score Comparison
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2 pl-4 pr-3 text-left text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                Metric
              </th>
              {tickers.map((t) => (
                <th
                  key={t}
                  className="py-2 px-3 text-center text-[10px] font-semibold tracking-widest text-slate-500 uppercase"
                >
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Z_METRICS.map(({ key, label }) => (
              <tr key={key} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 pl-4 pr-3 text-xs text-slate-400 whitespace-nowrap">
                  {label}
                </td>
                {tickers.map((t) => {
                  const v = altcoins[t].zscores[key];
                  return (
                    <td key={t} className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${zTextColor(v)} ${zBgColor(v)}`}
                      >
                        {v >= 0 ? '+' : ''}{v.toFixed(2)}σ
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
