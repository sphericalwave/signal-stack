import {
  ComposedChart, LineChart,
  Line, Area, Bar, Cell,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ReferenceArea, ReferenceLine,
} from 'recharts';
import {
  compositeSignals, zscoreIndicators,
  btcPrice, fearGreed, globalM2, mvrv,
  rsiWeekly, twitterSentiment, googleTrends,
} from '../data/mockData';
import ZScoreTable from '../components/ZScoreTable';
import SignalBadge from '../components/SignalBadge';
import ChartPanel from '../components/ChartPanel';

// ── Shared chart style helpers ──────────────────────────────────────────────
const GRID = { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.05)' };
const TICK = { fill: '#64748b', fontSize: 10 };
const TT_STYLE = {
  contentStyle: {
    background: '#1e2028',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    fontSize: 11,
    color: '#e2e8f0',
  },
};
const fmtDate = (v) => {
  const [yr, mo] = v.split('-');
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+mo - 1] + " '" + yr.slice(2);
};

// ── Data prep (sampled to every 5th day ≈ 146 pts) ─────────────────────────
const S = 5;

const btcMvrvData = btcPrice
  .filter((_, i) => i % S === 0)
  .map((d, i) => ({ date: d.date, btc: d.price, mvrv: mvrv[i * S]?.value }));

const m2BtcData = btcPrice
  .slice(90)
  .filter((_, i) => i % S === 0)
  .map((d, i) => ({ date: d.date, btc: d.price, m2: globalM2[i * S]?.value }));

const rsiData = rsiWeekly
  .filter((_, i) => i % S === 0)
  .map((d) => ({ date: d.date, rsi: d.value }));

const sentimentData = fearGreed
  .filter((_, i) => i % S === 0)
  .map((d, i) => ({
    date: d.date,
    fg: d.value,
    tw: Math.round((twitterSentiment[i * S]?.value ?? 0) * 50 + 50),
    gt: googleTrends[i * S]?.value,
  }));

// ── Sub-components ──────────────────────────────────────────────────────────
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

// ── Page ────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const latestFG   = fearGreed[fearGreed.length - 1]?.value ?? 0;
  const latestM2   = globalM2[globalM2.length - 1]?.value ?? 0;
  const latestMVRV = mvrv[mvrv.length - 1]?.value ?? 0;

  const xAxis = (data) => (
    <XAxis
      dataKey="date"
      tick={TICK}
      axisLine={false}
      tickLine={false}
      interval={Math.floor(data.length / 6)}
      tickFormatter={fmtDate}
    />
  );
  const yAxis = (id, opts = {}) => (
    <YAxis
      yAxisId={id}
      tick={TICK}
      axisLine={false}
      tickLine={false}
      width={48}
      {...opts}
    />
  );

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
          <MiniGauge label="Global M2 (T USD)" value={latestM2} max={120} colorCls="bg-blue-400" />
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

      {/* Charts */}
      <section>
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-3">
          Charts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* 1 — BTC Price + MVRV Bands */}
          <ChartPanel title="BTC Price + MVRV Bands" subtitle="green = undervalued  ·  red = overvalued">
            <ComposedChart data={btcMvrvData}>
              <CartesianGrid {...GRID} />
              {xAxis(btcMvrvData)}
              {yAxis('l', { tickFormatter: (v) => `$${(v / 1000).toFixed(0)}k` })}
              {yAxis('r', {
                orientation: 'right',
                domain: [0, 4.5],
                tickFormatter: (v) => v.toFixed(1),
              })}
              <Tooltip {...TT_STYLE} formatter={(v, n) => [n === 'btc' ? `$${v.toLocaleString()}` : v?.toFixed(3), n === 'btc' ? 'BTC' : 'MVRV']} labelFormatter={fmtDate} />
              <ReferenceArea yAxisId="r" y1={0}   y2={1}   fill="rgba(16,185,129,0.08)" />
              <ReferenceArea yAxisId="r" y1={2.5} y2={4.5} fill="rgba(239,68,68,0.08)"  />
              <ReferenceLine yAxisId="r" y={1}   stroke="rgba(16,185,129,0.35)" strokeDasharray="3 3" />
              <ReferenceLine yAxisId="r" y={2.5} stroke="rgba(239,68,68,0.35)"  strokeDasharray="3 3" />
              <Line yAxisId="l" type="monotone" dataKey="btc"  stroke="#F7931A" dot={false} strokeWidth={1.5} name="btc"  />
              <Line yAxisId="r" type="monotone" dataKey="mvrv" stroke="#34D399" dot={false} strokeWidth={1}   name="mvrv" />
            </ComposedChart>
          </ChartPanel>

          {/* 2 — Global M2 (90d lag) vs BTC */}
          <ChartPanel title="Global M2 (90d lag) vs BTC" subtitle="M2 leads BTC by ~90 days">
            <ComposedChart data={m2BtcData}>
              <CartesianGrid {...GRID} />
              {xAxis(m2BtcData)}
              {yAxis('l', { tickFormatter: (v) => `$${(v / 1000).toFixed(0)}k` })}
              {yAxis('r', {
                orientation: 'right',
                tickFormatter: (v) => `$${v.toFixed(0)}T`,
              })}
              <Tooltip {...TT_STYLE} formatter={(v, n) => [n === 'btc' ? `$${v.toLocaleString()}` : `$${v?.toFixed(1)}T`, n === 'btc' ? 'BTC' : 'M2 (90d)']} labelFormatter={fmtDate} />
              <Line yAxisId="l" type="monotone" dataKey="btc" stroke="#F7931A" dot={false} strokeWidth={1.5} name="btc" />
              <Line yAxisId="r" type="monotone" dataKey="m2"  stroke="#60A5FA" dot={false} strokeWidth={1.5} name="m2"  />
              <Legend
                wrapperStyle={{ fontSize: 10, color: '#94a3b8', paddingTop: 4 }}
                formatter={(v) => v === 'btc' ? 'BTC Price' : 'Global M2 (90d lag)'}
              />
            </ComposedChart>
          </ChartPanel>

          {/* 3 — RSI Weekly Ribbon */}
          <ChartPanel title="RSI Weekly" subtitle="overbought > 70  ·  oversold < 30">
            <ComposedChart data={rsiData}>
              <CartesianGrid {...GRID} />
              {xAxis(rsiData)}
              {yAxis('l', { domain: [20, 90] })}
              <Tooltip {...TT_STYLE} formatter={(v) => [v?.toFixed(1), 'RSI']} labelFormatter={fmtDate} />
              <ReferenceArea yAxisId="l" y1={70} y2={90} fill="rgba(239,68,68,0.1)"    />
              <ReferenceArea yAxisId="l" y1={20} y2={30} fill="rgba(16,185,129,0.1)"   />
              <ReferenceLine yAxisId="l" y={70} stroke="rgba(239,68,68,0.45)"  strokeDasharray="3 3" label={{ value: '70', fill: '#ef4444', fontSize: 9, position: 'insideTopRight' }} />
              <ReferenceLine yAxisId="l" y={30} stroke="rgba(16,185,129,0.45)" strokeDasharray="3 3" label={{ value: '30', fill: '#10b981', fontSize: 9, position: 'insideBottomRight' }} />
              <Area yAxisId="l" type="monotone" dataKey="rsi" stroke="#A78BFA" fill="rgba(167,139,250,0.12)" dot={false} strokeWidth={1.5} name="RSI" />
            </ComposedChart>
          </ChartPanel>

          {/* 4 — Sentiment Composite */}
          <ChartPanel title="Sentiment Composite" subtitle="Fear & Greed · Twitter · Google Trends">
            <LineChart data={sentimentData}>
              <CartesianGrid {...GRID} />
              {xAxis(sentimentData)}
              <YAxis tick={TICK} axisLine={false} tickLine={false} width={30} domain={[0, 100]} />
              <Tooltip {...TT_STYLE} labelFormatter={fmtDate} />
              <ReferenceLine y={70} stroke="rgba(239,68,68,0.3)"  strokeDasharray="3 3" />
              <ReferenceLine y={30} stroke="rgba(16,185,129,0.3)" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="fg" stroke="#F59E0B" dot={false} strokeWidth={1.5} name="Fear & Greed" />
              <Line type="monotone" dataKey="tw" stroke="#60A5FA" dot={false} strokeWidth={1}   name="Twitter" />
              <Line type="monotone" dataKey="gt" stroke="#34D399" dot={false} strokeWidth={1}   name="Google Trends" />
              <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8', paddingTop: 4 }} />
            </LineChart>
          </ChartPanel>

        </div>
      </section>

    </div>
  );
}
