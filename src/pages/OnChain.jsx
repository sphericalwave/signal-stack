import { zscoreIndicators } from '../data/mockData';
import ZScoreTable from '../components/ZScoreTable';

export default function OnChain() {
  const onChainIndicators = zscoreIndicators.filter((i) => i.category === 'on-chain');
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-base font-semibold text-white">On-Chain Metrics</h1>
      <ZScoreTable indicators={onChainIndicators} showCategories={false} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {onChainIndicators.map((ind) => (
          <div key={ind.name} className="bg-[#111318] border border-white/10 rounded-lg p-4 min-h-40 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-300">{ind.name}</span>
            <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-md">
              <span className="text-[11px] text-slate-600 font-mono">[ Chart — next session ]</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
