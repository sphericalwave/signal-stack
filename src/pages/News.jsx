import { useState } from 'react';
import { newsItems, tweets } from '../data/mockData';

const NEWS_TABS = ['All', 'Fed+Rates', 'US Dollar', 'Bitcoin', 'Altcoins', 'On-chain'];
const TWEET_TABS = ['All', 'Fed', 'USD', 'BTC', 'Alts'];

const SENTIMENT_STYLE = {
  bullish: 'text-green-400 bg-green-400/10 border border-green-400/20',
  bearish: 'text-red-400 bg-red-400/10 border border-red-400/20',
  neutral: 'text-amber-400 bg-amber-400/10 border border-amber-400/20',
};

export default function News() {
  const [newsTab, setNewsTab] = useState('All');
  const [tweetTab, setTweetTab] = useState('All');

  const filteredNews = newsTab === 'All' ? newsItems : newsItems.filter((n) => n.category === newsTab);
  const filteredTweets = tweetTab === 'All' ? tweets : tweets.filter((t) => t.category === tweetTab);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      {/* Alert strip */}
      <div className="mb-4 bg-amber-400/10 border border-amber-400/20 rounded-lg px-4 py-2 flex items-center gap-2">
        <span className="text-amber-400 text-xs font-semibold">⚡ Fed Speaker</span>
        <span className="text-xs text-slate-300">Powell testimony to Senate Banking Committee — today 14:00 ET</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News */}
        <div>
          <div className="flex gap-1 mb-4 flex-wrap">
            {NEWS_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setNewsTab(t)}
                className={`text-[11px] px-2 py-1 rounded font-medium transition-colors ${
                  newsTab === t
                    ? 'bg-white/10 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {filteredNews.map((n) => (
              <div key={n.id} className="bg-[#111318] border border-white/10 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-500">{n.source}</span>
                  <span className="text-[10px] text-slate-600">{n.time}</span>
                  <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-semibold ${SENTIMENT_STYLE[n.sentiment]}`}>
                    {n.sentiment}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{n.headline}</p>
                <div className="flex gap-1 flex-wrap">
                  {n.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tweets */}
        <div>
          <div className="flex gap-1 mb-4">
            {TWEET_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTweetTab(t)}
                className={`text-[11px] px-2 py-1 rounded font-medium transition-colors ${
                  tweetTab === t
                    ? 'bg-white/10 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {filteredTweets.map((tw) => (
              <div key={tw.id} className="bg-[#111318] border border-white/10 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                    {tw.initials}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">{tw.handle}</span>
                  <span className="text-[10px] text-slate-600 ml-auto">{tw.time} ago</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{tw.text}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {tw.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {tw.engagement.toLocaleString()} ❤
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
