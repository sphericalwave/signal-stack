import { ResponsiveContainer } from 'recharts';

export default function ChartPanel({ title, subtitle, children, height = 220 }) {
  return (
    <div className="bg-[#111318] border border-white/10 rounded-lg p-4 flex flex-col gap-3">
      <div>
        <span className="text-xs font-semibold text-slate-300">{title}</span>
        {subtitle && <span className="text-[10px] text-slate-500 ml-2">{subtitle}</span>}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
