import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import SignalBadge from './SignalBadge';

const COIN_COLORS = {
  BTC:  '#f59e0b',
  ETH:  '#818cf8',
  SOL:  '#a78bfa',
  HYPE: '#22d3ee',
};

function Stat({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-mono text-slate-200">{value}</span>
    </div>
  );
}

export default function CoinCard({ ticker, data }) {
  const isUp = data.change24h >= 0;
  const color = COIN_COLORS[ticker] ?? '#94a3b8';
  const sparkData = data.sparkline.map((v) => ({ v }));

  return (
    <div className="bg-[#111318] border border-white/10 rounded-lg p-4 space-y-3 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
            style={{ backgroundColor: color + '28', color }}
          >
            {ticker[0]}
          </span>
          <span className="font-mono text-sm font-bold text-white">{ticker}</span>
          <SignalBadge signal={data.signal} />
        </div>
        <div className="w-20 h-9 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
              <defs>
                <linearGradient id={`sg-${ticker}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={isUp ? '#22c55e' : '#f87171'} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={isUp ? '#22c55e' : '#f87171'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={isUp ? '#22c55e' : '#f87171'}
                strokeWidth={1.5}
                fill={`url(#sg-${ticker})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-xl font-semibold text-white">
          ${data.price.toLocaleString()}
        </span>
        <span className={`font-mono text-sm font-semibold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
          {isUp ? '+' : ''}{data.change24h}%
        </span>
      </div>

      <div className="space-y-1.5 text-[11px]">
        <Stat label="RSI 1W" value={data.rsi1w} />
        {data.mvrv    != null && <Stat label="MVRV"    value={data.mvrv} />}
        {data.ethbtc  != null && <Stat label="ETH/BTC" value={data.ethbtc} />}
        {data.tps     != null && <Stat label="TPS"     value={data.tps.toLocaleString()} />}
        {data.perpVol != null && <Stat label="Perp Vol" value={`$${data.perpVol}`} />}
      </div>
    </div>
  );
}
