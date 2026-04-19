import {
  ComposedChart,
  Line, Area, Bar, Cell,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ReferenceArea, ReferenceLine,
} from 'recharts';
import {
  zscoreIndicators,
  mvrv, nupl, soprLTH, puellMultiple, piCycleTop, exchangeNetFlow,
  lthSupply, feeRevenue, activeAddresses,
} from '../data/mockData';
import ZScoreTable from '../components/ZScoreTable';
import ChartPanel from '../components/ChartPanel';

// ── Shared chart style ──────────────────────────────────────────────────────
const GRID = { strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.05)' };
const TICK = { fill: '#64748b', fontSize: 10 };
const TT   = {
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

// ── Generic indicator chart ─────────────────────────────────────────────────
function IndicatorChart({ title, data, dataKey = 'value', color, refLines = [], refAreas = [], isBar = false, domain, height = 190 }) {
  const sampled = data.filter((_, i) => i % 5 === 0).map((d) => ({ date: d.date, val: d[dataKey] }));
  return (
    <ChartPanel title={title} height={height}>
      <ComposedChart data={sampled}>
        <CartesianGrid {...GRID} />
        <XAxis
          dataKey="date"
          tick={TICK}
          axisLine={false}
          tickLine={false}
          interval={Math.floor(sampled.length / 6)}
          tickFormatter={fmtDate}
        />
        <YAxis tick={TICK} axisLine={false} tickLine={false} width={48} domain={domain} />
        <Tooltip {...TT} formatter={(v) => [typeof v === 'number' ? v.toFixed(4) : v, title]} labelFormatter={fmtDate} />
        {refAreas.map((ra, i) => (
          <ReferenceArea key={i} y1={ra.y1} y2={ra.y2} fill={ra.fill} />
        ))}
        {refLines.map((rl, i) => (
          <ReferenceLine key={i} y={rl.y} stroke={rl.stroke} strokeDasharray="3 3" />
        ))}
        {isBar ? (
          <Bar dataKey="val" name={title} radius={[1, 1, 0, 0]}>
            {sampled.map((entry, idx) => (
              <Cell key={idx} fill={entry.val >= 0 ? 'rgba(239,68,68,0.65)' : 'rgba(16,185,129,0.65)'} />
            ))}
          </Bar>
        ) : (
          <Line type="monotone" dataKey="val" stroke={color} dot={false} strokeWidth={1.5} name={title} />
        )}
      </ComposedChart>
    </ChartPanel>
  );
}

// ── Indicator config map ────────────────────────────────────────────────────
const CHART_CFG = {
  'MVRV ratio': {
    data: mvrv, color: '#34D399',
    domain: [0, 4],
    refAreas: [
      { y1: 0,   y2: 1,   fill: 'rgba(16,185,129,0.08)' },
      { y1: 2.5, y2: 4,   fill: 'rgba(239,68,68,0.08)'  },
    ],
    refLines: [
      { y: 1,   stroke: 'rgba(16,185,129,0.45)' },
      { y: 2.5, stroke: 'rgba(239,68,68,0.45)'  },
    ],
  },
  'NUPL': {
    data: nupl, color: '#A78BFA',
    refAreas: [{ y1: -1, y2: 0, fill: 'rgba(239,68,68,0.07)' }],
    refLines: [{ y: 0, stroke: 'rgba(148,163,184,0.45)' }],
  },
  'SOPR (LTH)': {
    data: soprLTH, color: '#60A5FA',
    refLines: [{ y: 1.0, stroke: 'rgba(148,163,184,0.55)' }],
  },
  'Puell multiple': {
    data: puellMultiple, color: '#FB923C',
    refAreas: [
      { y1: 0,   y2: 0.5, fill: 'rgba(16,185,129,0.08)' },
      { y1: 2.0, y2: 5,   fill: 'rgba(239,68,68,0.08)'  },
    ],
    refLines: [
      { y: 0.5, stroke: 'rgba(16,185,129,0.45)' },
      { y: 2.0, stroke: 'rgba(239,68,68,0.45)'  },
    ],
  },
  'Pi cycle top distance': {
    data: piCycleTop, color: '#F472B6',
    refAreas: [{ y1: -0.5, y2: 0, fill: 'rgba(239,68,68,0.07)' }],
    refLines: [{ y: 0, stroke: 'rgba(248,113,113,0.55)' }],
  },
  'Exchange net flow': {
    data: exchangeNetFlow, isBar: true, color: '#94a3b8',
    refLines: [{ y: 0, stroke: 'rgba(148,163,184,0.5)' }],
  },
};

// ── Page ────────────────────────────────────────────────────────────────────
export default function OnChain() {
  const onChainIndicators = zscoreIndicators.filter((i) => i.category === 'on-chain');

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-base font-semibold text-white">On-Chain Metrics</h1>

      <ZScoreTable indicators={onChainIndicators} showCategories={false} />

      {/* Per-indicator charts */}
      <section>
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-3">
          Cycle Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {onChainIndicators.map((ind) => {
            const cfg = CHART_CFG[ind.name];
            if (!cfg) return null;
            return (
              <IndicatorChart
                key={ind.name}
                title={ind.name}
                data={cfg.data}
                color={cfg.color}
                refLines={cfg.refLines}
                refAreas={cfg.refAreas}
                isBar={cfg.isBar}
                domain={cfg.domain}
              />
            );
          })}
        </div>
      </section>

      {/* Network health charts */}
      <section>
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-3">
          Network Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <IndicatorChart
            title="LTH Supply %"
            data={lthSupply}
            color="#34D399"
            refLines={[{ y: 70, stroke: 'rgba(16,185,129,0.4)' }]}
          />
          <IndicatorChart
            title="Fee Revenue (BTC)"
            data={feeRevenue}
            color="#FB923C"
          />
          <IndicatorChart
            title="Active Addresses (k)"
            data={activeAddresses}
            color="#60A5FA"
          />
        </div>
      </section>
    </div>
  );
}
