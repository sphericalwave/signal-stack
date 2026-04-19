import { compositeSignals, zscoreIndicators, btcPrice, fearGreed, globalM2, mvrv } from '../data/mockData';
import ZScoreTable from '../components/ZScoreTable';
import SignalBadge from '../components/SignalBadge';

function CompositeCard({ signal }) {
  const { label, value, zscore, change, direction } = signal;
  const isUp = direction === 'up';
  const zColor = zscore > 1 ? 'text-green-400' : zscore < -1 ? 'text-red-400' : 'text-amber-400';
  return (
    <div className="bg-[#111318] border border-white/10 rounded-lg p-4 flex flex-col gap-2">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-lg font-semibold text-white">{value}</span>
        <SignalBadge signal={zscore > 1 ? 'buy' : zscore < -1 ? 'caution' : 'neutral'} />
      </div>
      <div className="flex items-center gap-3 mt-1">
        <span className={`font-mono text-sm font-semibold ${zColor}`}>
          {zscore > 0 ? '+' : ''}{zscore.toFixed(2)}σ
        </span>
        <span className={`font-mono text-xs ${isUp ? 'text-green-400' : 'text-red-400'}`}>
          {isUp ? '▲' : '▼'} {change}
        </span>
      </div>
    </div>
  );
}

function MiniGauge({ label, value, max, colorCls }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="bg-[#111318] border border-white/10 rounded-lg p-4 flex flex-col gap-3">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500">{label}</span>
      <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full rounded-full ${colorCls}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between items-end">
        <span className={`font-mono text-2xl font-semibold ${colorCls.replace('bg-', 'text-')}`}>
          {typeof value === 'number' ? value.toFixed(value < 10 ? 2 : 0) : value}
        </span>
        <span className="text-xs text-slate-500">/ {max}</span>
      </div>
    </div>
  );
}

function ChartPlaceholder({ title, subtitle }) {
  return (
    <div className="bg-[#111318] border border-white/10 rounded-lg p-4 flex flex-col gap-2 min-h-52">
      <div>
        <span className="text-xs font-semibold text-slate-300">{title}</span>
        {subtitle && <span className="text-[10px] text-slate-500 ml-2">{subtitle}</span>}
      </div>
      <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-md">
        <span className="text-[11px] text-slate-600 font-mono">[ Recharts — next session ]</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const latestFG = fearGreed[fearGreed.length - 1]?.value ?? 0;
  const latestM2 = globalM2[globalM2.length - 1]?.value ?? 0;
  const latestMVRV = mvrv[mvrv.length - 1]?.value ?? 0;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">
      {/* Composite Signal Cards */}
      <section>
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-3">
          Composite Signals
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.values(compositeSignals).map((sig) => (
            <CompositeCard key={sig.label} signal={sig} />
          ))}
        </div>
      </section>

      {/* Mini Gauges */}
      <section>
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-3">
          Key Gauges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MiniGauge
            label="Fear & Greed Index"
            value={latestFG}
            max={100}
            colorCls={latestFG > 60 ? 'bg-green-500' : latestFG < 30 ? 'bg-red-400' : 'bg-amber-400'}
          />
          <MiniGauge
            label="Global M2 (T USD)"
            value={latestM2}
            max={120}
            colorCls="bg-blue-400"
          />
          <MiniGauge
            label="MVRV Ratio"
            value={latestMVRV}
            max={4}
            colorCls={latestMVRV > 2.5 ? 'bg-red-400' : latestMVRV > 1 ? 'bg-green-500' : 'bg-amber-400'}
          />
        </div>
      </section>

      {/* Z-Score Table */}
      <section>
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-3">
          All Indicators — Z-Score Heatmap
        </h2>
        <ZScoreTable indicators={zscoreIndicators} showCategories={true} />
      </section>

      {/* Chart Placeholders */}
      <section>
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-3">
          Charts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ChartPlaceholder title="BTC Price + MVRV Bands" subtitle="colored background zones" />
          <ChartPlaceholder title="Global M2 (90d lag) vs BTC Price" subtitle="dual axis" />
          <ChartPlaceholder title="RSI Weekly Z-Score Ribbon" subtitle="overbought / oversold zones" />
          <ChartPlaceholder title="Sentiment Composite" subtitle="Fear&Greed · Twitter · Google Trends" />
        </div>
      </section>
    </div>
  );
}
