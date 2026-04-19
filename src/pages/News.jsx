import { useState } from 'react';
import { newsItems, tweets } from '../data/mockData';
import NewsCard from '../components/NewsCard';
import TweetCard from '../components/TweetCard';

const NEWS_TABS = ['All', 'Fed+Rates', 'US Dollar', 'Bitcoin', 'Altcoins', 'On-chain'];
const TWEET_TABS = ['All', 'Fed', 'USD', 'BTC', 'Alts'];

function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 mb-4 flex-wrap">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`text-[11px] px-2.5 py-1 rounded font-medium transition-colors ${
            active === t
              ? 'bg-white/10 text-white'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default function News() {
  const [newsTab, setNewsTab] = useState('All');
  const [tweetTab, setTweetTab] = useState('All');

  const filteredNews =
    newsTab === 'All' ? newsItems : newsItems.filter((n) => n.category === newsTab);
  const filteredTweets =
    tweetTab === 'All' ? tweets : tweets.filter((t) => t.category === tweetTab);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      {/* Fed speaker alert */}
      <div className="mb-5 bg-amber-400/10 border border-amber-400/20 rounded-lg px-4 py-2.5 flex items-center gap-3">
        <span className="text-amber-400 text-xs font-semibold tracking-wide">⚡ FED SPEAKER</span>
        <span className="text-xs text-slate-300">
          Powell testimony to Senate Banking Committee — today 14:00 ET
        </span>
        <span className="ml-auto text-[10px] text-amber-400/70 font-mono">SCHEDULED</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News feed */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">News Feed</h2>
            <span className="text-[10px] text-slate-600 font-mono">{filteredNews.length} items</span>
          </div>
          <TabBar tabs={NEWS_TABS} active={newsTab} onChange={setNewsTab} />
          <div className="space-y-2">
            {filteredNews.length > 0 ? (
              filteredNews.map((n) => <NewsCard key={n.id} item={n} />)
            ) : (
              <p className="text-xs text-slate-600 py-8 text-center">No items in this category</p>
            )}
          </div>
        </div>

        {/* Tweet feed */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              𝕏 Curated Feed
            </h2>
            <span className="text-[10px] text-slate-600 font-mono">{filteredTweets.length} posts</span>
          </div>
          <TabBar tabs={TWEET_TABS} active={tweetTab} onChange={setTweetTab} />
          <div className="space-y-2">
            {filteredTweets.length > 0 ? (
              filteredTweets.map((tw) => <TweetCard key={tw.id} tweet={tw} />)
            ) : (
              <p className="text-xs text-slate-600 py-8 text-center">No posts in this category</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
