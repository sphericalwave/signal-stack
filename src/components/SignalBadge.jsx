export default function SignalBadge({ signal }) {
  const config = {
    buy:      { label: 'BUY',     cls: 'text-green-400 bg-green-400/10 border-green-400/30' },
    accumulate: { label: 'ACCUM', cls: 'text-green-400 bg-green-400/10 border-green-400/30' },
    neutral:  { label: 'NEUTRAL', cls: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
    watch:    { label: 'WATCH',   cls: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
    caution:  { label: 'CAUTION', cls: 'text-red-400 bg-red-400/10 border-red-400/30'       },
    sell:     { label: 'SELL',    cls: 'text-red-400 bg-red-400/10 border-red-400/30'       },
  };
  const { label, cls } = config[signal?.toLowerCase()] ?? config.neutral;
  return (
    <span
      className={`font-mono text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded border ${cls}`}
    >
      {label}
    </span>
  );
}
