import SignalBadge from './SignalBadge';

const CATEGORY_ORDER = ['on-chain', 'technical', 'macro', 'sentiment'];
const CATEGORY_LABELS = {
  'on-chain':  'ON-CHAIN',
  'technical': 'TECHNICAL',
  'macro':     'MACRO',
  'sentiment': 'SENTIMENT',
};

function ZScoreBar({ zscore }) {
  const clamped = Math.max(-3, Math.min(3, zscore));
  const pct = ((clamped + 3) / 6) * 100; // 0% = -3σ, 50% = 0, 100% = +3σ
  const isPositive = clamped >= 0;
  const barColor = Math.abs(clamped) <= 0.5
    ? 'bg-amber-400'
    : isPositive
      ? 'bg-green-500'
      : 'bg-red-400';

  return (
    <div className="relative flex items-center h-4 w-full">
      {/* track */}
      <div className="absolute inset-0 rounded-sm bg-white/5" />
      {/* center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
      {/* bar */}
      {isPositive ? (
        <div
          className={`absolute h-2 top-1 rounded-sm ${barColor}`}
          style={{ left: '50%', width: `${((clamped) / 3) * 50}%` }}
        />
      ) : (
        <div
          className={`absolute h-2 top-1 rounded-sm ${barColor}`}
          style={{
            right: '50%',
            width: `${(Math.abs(clamped) / 3) * 50}%`,
          }}
        />
      )}
    </div>
  );
}

function ZScoreValue({ zscore }) {
  const abs = Math.abs(zscore);
  const colorCls =
    abs <= 0.5
      ? 'text-amber-400'
      : zscore > 0
        ? 'text-green-400'
        : 'text-red-400';
  const prefix = zscore > 0 ? '+' : '';
  return (
    <span className={`font-mono text-xs font-semibold tabular-nums ${colorCls}`}>
      {prefix}{zscore.toFixed(2)}σ
    </span>
  );
}

function IndicatorRow({ indicator }) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
      <td className="py-2 pl-4 pr-2 text-xs text-slate-300 whitespace-nowrap w-48">
        {indicator.name}
      </td>
      <td className="py-2 px-3 w-48">
        <ZScoreBar zscore={indicator.zscore} />
      </td>
      <td className="py-2 px-3 text-right w-20">
        <ZScoreValue zscore={indicator.zscore} />
      </td>
      <td className="py-2 pr-4 pl-2 text-right w-24">
        <SignalBadge signal={indicator.signal} />
      </td>
    </tr>
  );
}

export default function ZScoreTable({ indicators = [], showCategories = true }) {
  if (!showCategories) {
    return (
      <div className="rounded-lg border border-white/10 overflow-hidden bg-[#111318]">
        <table className="w-full">
          <tbody>
            {indicators.map((ind) => (
              <IndicatorRow key={ind.name} indicator={ind} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const rows = indicators.filter((i) => i.category === cat);
    if (rows.length) acc.push({ cat, rows });
    return acc;
  }, []);

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden bg-[#111318]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-2 pl-4 pr-2 text-left text-[10px] font-semibold tracking-widest text-slate-500 uppercase">Indicator</th>
            <th className="py-2 px-3 text-left text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
              <span className="flex items-center gap-1">
                <span className="text-red-400/60">-3σ</span>
                <span className="flex-1 text-center">z-score bar</span>
                <span className="text-green-400/60">+3σ</span>
              </span>
            </th>
            <th className="py-2 px-3 text-right text-[10px] font-semibold tracking-widest text-slate-500 uppercase">z-score</th>
            <th className="py-2 pr-4 pl-2 text-right text-[10px] font-semibold tracking-widest text-slate-500 uppercase">Signal</th>
          </tr>
        </thead>
        <tbody>
          {grouped.map(({ cat, rows }) => (
            <>
              <tr key={`hdr-${cat}`} className="bg-white/[0.02] border-t border-white/10">
                <td
                  colSpan={4}
                  className="py-1.5 pl-4 text-[10px] font-semibold tracking-widest text-slate-500 uppercase"
                >
                  {CATEGORY_LABELS[cat]}
                </td>
              </tr>
              {rows.map((ind) => (
                <IndicatorRow key={ind.name} indicator={ind} />
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
