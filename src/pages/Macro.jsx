import { zscoreIndicators } from '../data/mockData';
import ZScoreTable from '../components/ZScoreTable';

export default function Macro() {
  const macroIndicators = zscoreIndicators.filter((i) => i.category === 'macro');
  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-base font-semibold text-white">Macro Indicators</h1>
      <p className="text-xs text-slate-500">Global M2 · Bond yields · DXY · Credit spreads · PBoC M2 · Fed balance sheet</p>
      <ZScoreTable indicators={macroIndicators} showCategories={false} />
      <div className="bg-[#111318] border border-white/10 rounded-lg p-4 min-h-64 flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-300">Global M2 (90d lag) vs BTC Price</span>
        <p className="text-[11px] text-slate-500">Flagship macro chart — dual axis, M2 lagged 90 days</p>
        <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-md">
          <span className="text-[11px] text-slate-600 font-mono">[ Recharts — next session ]</span>
        </div>
      </div>
    </div>
  );
}
