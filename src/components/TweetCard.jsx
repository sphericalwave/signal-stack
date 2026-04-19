const HANDLE_COLORS = [
  'bg-blue-500/20 text-blue-400',
  'bg-purple-500/20 text-purple-400',
  'bg-cyan-500/20 text-cyan-400',
  'bg-emerald-500/20 text-emerald-400',
  'bg-orange-500/20 text-orange-400',
];

function avatarColor(initials) {
  const sum = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  return HANDLE_COLORS[sum % HANDLE_COLORS.length];
}

export default function TweetCard({ tweet }) {
  return (
    <div className="bg-[#111318] border border-white/10 rounded-lg p-3 space-y-1.5 hover:border-white/20 transition-colors">
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${avatarColor(tweet.initials)}`}>
          {tweet.initials}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-slate-300 leading-none">{tweet.handle}</span>
        </div>
        <span className="text-[10px] text-slate-600 ml-auto shrink-0">{tweet.time} ago</span>
      </div>
      <p className="text-xs text-slate-200 leading-relaxed">{tweet.text}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {tweet.tags.map((tag) => (
            <span key={tag} className="text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono shrink-0">
          <span>♥</span>
          <span>{tweet.engagement.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
