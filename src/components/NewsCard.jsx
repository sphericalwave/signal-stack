const SENTIMENT_STYLE = {
  bullish: 'text-green-400 bg-green-400/10 border border-green-400/20',
  bearish: 'text-red-400 bg-red-400/10 border border-red-400/20',
  neutral: 'text-amber-400 bg-amber-400/10 border border-amber-400/20',
};

export default function NewsCard({ item }) {
  return (
    <div className="bg-[#111318] border border-white/10 rounded-lg p-3 space-y-1.5 hover:border-white/20 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{item.source}</span>
        <span className="text-[10px] text-slate-600">{item.time}</span>
        <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-semibold ${SENTIMENT_STYLE[item.sentiment]}`}>
          {item.sentiment}
        </span>
      </div>
      <p className="text-xs text-slate-200 leading-relaxed">{item.headline}</p>
      <div className="flex gap-1 flex-wrap">
        {item.tags.map((tag) => (
          <span key={tag} className="text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
