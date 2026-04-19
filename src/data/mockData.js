// All mock data lives here. Replace each export with real API calls later.

function dateRange(days) {
  const dates = [];
  const end = new Date('2026-04-19');
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function walk(start, volatility, drift, days) {
  const result = [start];
  for (let i = 1; i < days; i++) {
    const prev = result[i - 1];
    const change = prev * (drift + (Math.random() - 0.5) * volatility);
    result.push(Math.max(prev + change, 0.01));
  }
  return result;
}

function sineWave(base, amplitude, period, days) {
  return Array.from({ length: days }, (_, i) =>
    base + amplitude * Math.sin((2 * Math.PI * i) / period) + (Math.random() - 0.5) * amplitude * 0.3
  );
}

const DAYS = 730; // ~2 years daily
const dates = dateRange(DAYS);

// BTC Price — realistic bull/bear cycle
const btcRaw = (() => {
  const prices = [28000];
  for (let i = 1; i < DAYS; i++) {
    const prev = prices[i - 1];
    // Bull run into late 2024, correction, re-accumulate
    const trend = i < 200 ? 0.0015 : i < 350 ? -0.002 : i < 500 ? 0.001 : i < 600 ? 0.003 : 0.0005;
    const noise = (Math.random() - 0.48) * 0.04;
    prices.push(Math.max(prev * (1 + trend + noise), 15000));
  }
  return prices;
})();

export const btcPrice = dates.map((date, i) => ({ date, price: Math.round(btcRaw[i]) }));

// MVRV Ratio — cycles between 0.8 and 3.5
export const mvrv = dates.map((date, i) => ({
  date,
  value: parseFloat(
    (1.2 + 1.3 * Math.sin((2 * Math.PI * i) / 420) + 0.3 * Math.sin((2 * Math.PI * i) / 90) + (Math.random() - 0.5) * 0.15).toFixed(3)
  ),
}));

// NUPL — ranges -0.5 to 0.85
export const nupl = dates.map((date, i) => ({
  date,
  value: parseFloat(
    (0.2 + 0.45 * Math.sin((2 * Math.PI * i) / 420) + 0.1 * Math.sin((2 * Math.PI * i) / 80) + (Math.random() - 0.5) * 0.08).toFixed(4)
  ),
}));

// SOPR LTH — around 1.0, dips below in bear markets
export const soprLTH = dates.map((date, i) => ({
  date,
  value: parseFloat(
    (1.02 + 0.12 * Math.sin((2 * Math.PI * i) / 420) + (Math.random() - 0.5) * 0.04).toFixed(4)
  ),
}));

// Puell Multiple — spikes at miners capitulate
export const puellMultiple = dates.map((date, i) => ({
  date,
  value: parseFloat(
    Math.max(0.4, 1.1 + 0.7 * Math.sin((2 * Math.PI * i) / 420) + 0.4 * Math.abs(Math.sin((2 * Math.PI * i) / 60)) * (Math.random() * 0.5)).toFixed(3)
  ),
}));

// Pi Cycle Top Distance — oscillates, negative = below top MA
export const piCycleTop = dates.map((date, i) => ({
  date,
  value: parseFloat(
    (-0.05 + 0.3 * Math.sin((2 * Math.PI * i) / 420) + (Math.random() - 0.5) * 0.05).toFixed(4)
  ),
}));

// Exchange Net Flow — positive = inflow (bearish), negative = outflow (bullish)
export const exchangeNetFlow = dates.map((date, i) => ({
  date,
  value: parseFloat(
    ((Math.random() - 0.52) * 8000 + 500 * Math.sin((2 * Math.PI * i) / 60)).toFixed(0)
  ),
}));

// RSI Weekly — 30-80 range
export const rsiWeekly = dates.map((date, i) => ({
  date,
  value: parseFloat(
    Math.min(85, Math.max(25, 55 + 22 * Math.sin((2 * Math.PI * i) / 420) + 8 * Math.sin((2 * Math.PI * i) / 90) + (Math.random() - 0.5) * 6)).toFixed(1)
  ),
}));

// Funding Rate — % annualized, swings between -50% and +200%
export const fundingRate = dates.map((date, i) => ({
  date,
  value: parseFloat(
    (15 + 40 * Math.sin((2 * Math.PI * i) / 420) + 30 * Math.sin((2 * Math.PI * i) / 60) + (Math.random() - 0.5) * 20).toFixed(2)
  ),
}));

// Options Put/Call Skew — negative = put premium (bearish), positive = call premium (bullish)
export const putCallSkew = dates.map((date, i) => ({
  date,
  value: parseFloat(
    (0.02 + 0.15 * Math.sin((2 * Math.PI * i) / 420) + (Math.random() - 0.5) * 0.05).toFixed(4)
  ),
}));

// Global M2 — trillion USD, steady growth with fluctuations
export const globalM2 = (() => {
  const base = walk(96, 0.008, 0.0004, DAYS);
  return dates.map((date, i) => ({ date, value: parseFloat(base[i].toFixed(2)) }));
})();

// Yield Curve Spread (2s10s) — basis points, inverted from -110 to recovering
export const yieldCurve = dates.map((date, i) => ({
  date,
  spread: parseFloat(
    (-80 + 100 * (i / DAYS) + 20 * Math.sin((2 * Math.PI * i) / 180) + (Math.random() - 0.5) * 15).toFixed(1)
  ),
}));

// DXY — 98-115 range
export const dxy = dates.map((date, i) => ({
  date,
  value: parseFloat(
    (104 + 6 * Math.sin((2 * Math.PI * i) / 365) + 3 * Math.sin((2 * Math.PI * i) / 120) + (Math.random() - 0.5) * 1.5).toFixed(2)
  ),
}));

// Fear & Greed — 0-100
export const fearGreed = dates.map((date, i) => ({
  date,
  value: Math.round(
    Math.min(95, Math.max(8, 55 + 35 * Math.sin((2 * Math.PI * i) / 420) + 15 * Math.sin((2 * Math.PI * i) / 60) + (Math.random() - 0.5) * 12))
  ),
}));

// Twitter Sentiment — normalized -1 to +1
export const twitterSentiment = dates.map((date, i) => ({
  date,
  value: parseFloat(
    (0.1 + 0.6 * Math.sin((2 * Math.PI * i) / 420) + 0.2 * Math.sin((2 * Math.PI * i) / 30) + (Math.random() - 0.5) * 0.2).toFixed(3)
  ),
}));

// Google Trends — 0-100
export const googleTrends = dates.map((date, i) => ({
  date,
  value: Math.round(
    Math.min(100, Math.max(5, 35 + 40 * Math.sin((2 * Math.PI * i) / 420) + 15 * (Math.random())))
  ),
}));

// LTH Supply % — long-term holders' % of supply
export const lthSupply = dates.map((date, i) => ({
  date,
  value: parseFloat(
    (68 + 8 * Math.sin((2 * Math.PI * (i + 210)) / 420) + (Math.random() - 0.5) * 1.5).toFixed(2)
  ),
}));

// Fee Revenue Z-Score raw values
export const feeRevenue = dates.map((date, i) => ({
  date,
  value: parseFloat(
    Math.max(0.5, 8 + 10 * Math.sin((2 * Math.PI * i) / 420) + 5 * Math.abs(Math.sin((2 * Math.PI * i) / 45)) * Math.random()).toFixed(2)
  ),
}));

// Active Address Momentum — daily active addresses (thousands)
export const activeAddresses = dates.map((date, i) => ({
  date,
  value: Math.round(
    850 + 400 * Math.sin((2 * Math.PI * i) / 420) + 100 * Math.sin((2 * Math.PI * i) / 60) + (Math.random() - 0.5) * 80
  ),
}));

// Credit Spreads — HY-IG basis points
export const creditSpreads = dates.map((date, i) => ({
  date,
  value: parseFloat(
    (320 + 80 * Math.sin((2 * Math.PI * (i + 60)) / 420) + (Math.random() - 0.5) * 20).toFixed(1)
  ),
}));

// US 10Y Yield
export const us10y = dates.map((date, i) => ({
  date,
  value: parseFloat(
    (4.2 + 0.8 * Math.sin((2 * Math.PI * i) / 420) + 0.3 * Math.sin((2 * Math.PI * i) / 90) + (Math.random() - 0.5) * 0.1).toFixed(3)
  ),
}));

// PBoC M2 Growth YoY %
export const pbocM2 = dates.map((date, i) => ({
  date,
  value: parseFloat(
    (8.5 + 2.5 * Math.sin((2 * Math.PI * i) / 365) + (Math.random() - 0.5) * 0.8).toFixed(1)
  ),
}));

// Fed Balance Sheet — trillion USD
export const fedBalanceSheet = (() => {
  const vals = walk(7.5, 0.01, -0.0003, DAYS);
  return dates.map((date, i) => ({ date, value: parseFloat(vals[i].toFixed(3)) }));
})();

// Current indicator snapshot with z-scores
export const zscoreIndicators = [
  { name: 'MVRV ratio',             category: 'on-chain',  zscore: 1.8,  signal: 'buy'     },
  { name: 'NUPL',                   category: 'on-chain',  zscore: 1.4,  signal: 'buy'     },
  { name: 'SOPR (LTH)',             category: 'on-chain',  zscore: 0.6,  signal: 'neutral' },
  { name: 'Puell multiple',         category: 'on-chain',  zscore: -0.3, signal: 'neutral' },
  { name: 'Pi cycle top distance',  category: 'on-chain',  zscore: 0.9,  signal: 'neutral' },
  { name: 'Exchange net flow',      category: 'on-chain',  zscore: -1.4, signal: 'caution' },
  { name: 'RSI (weekly)',           category: 'technical', zscore: 1.1,  signal: 'buy'     },
  { name: 'Funding rate (perps)',   category: 'technical', zscore: 0.7,  signal: 'neutral' },
  { name: 'Options put/call skew',  category: 'technical', zscore: -0.5, signal: 'neutral' },
  { name: 'Global M2 (90d lag)',    category: 'macro',     zscore: 2.1,  signal: 'buy'     },
  { name: 'Bond yield spread (2s10s)', category: 'macro',  zscore: 0.4,  signal: 'neutral' },
  { name: 'DXY z-score',           category: 'macro',     zscore: -1.1, signal: 'caution' },
  { name: 'Fear & Greed index',     category: 'sentiment', zscore: 1.6,  signal: 'buy'     },
  { name: 'Twitter sentiment',      category: 'sentiment', zscore: 0.8,  signal: 'neutral' },
  { name: 'Google Trends (bitcoin)',category: 'sentiment', zscore: 0.3,  signal: 'neutral' },
];

export const compositeSignals = {
  overall:         { label: 'Overall Signal',       value: 'Accumulate', zscore: 1.12, change: '+0.3',  direction: 'up'   },
  globalLiquidity: { label: 'Global Liquidity',     value: 'Bullish',    zscore: 2.10, change: '+0.15', direction: 'up'   },
  bondStress:      { label: 'Bond Stress',          value: 'Neutral',    zscore: -0.4, change: '-0.2',  direction: 'down' },
  btcCycle:        { label: 'BTC Cycle Position',   value: 'Mid-cycle',  zscore: 1.35, change: '+0.05', direction: 'up'   },
};

export const altcoins = {
  BTC:  { price: 84210,  change24h: 2.4,  rsi1w: 61, mvrv: 2.1,     signal: 'accumulate', sparkline: btcRaw.slice(-30),
          zscores: { rsi: 0.8, momentum: 1.2, onchain: 1.8, relStrength: 0 } },
  ETH:  { price: 1584,   change24h: -0.8, rsi1w: 44, ethbtc: 0.0188, signal: 'watch',      sparkline: walk(1600, 0.04, 0, 30),
          zscores: { rsi: -0.4, momentum: -1.1, onchain: -0.3, relStrength: -2.1 } },
  SOL:  { price: 131.4,  change24h: 3.1,  rsi1w: 55, tps: 3241,     signal: 'accumulate', sparkline: walk(125, 0.05, 0.001, 30),
          zscores: { rsi: 0.3, momentum: 0.9, onchain: 1.1, relStrength: -0.4 } },
  HYPE: { price: 14.82,  change24h: 5.7,  rsi1w: 67, perpVol: '4.1B', signal: 'watch',    sparkline: walk(12, 0.07, 0.003, 30),
          zscores: { rsi: 1.4, momentum: 2.1, onchain: 0.7, relStrength: 0.8 } },
};

export const blockStats = {
  height: 893441,
  difficulty: '109.78T',
  hashrate: '798 EH/s',
  nextDiffAdj: '+2.1%',
  mempoolTx: 84000,
  avgFee: '18 sat/vb',
};

export const newsItems = [
  {
    id: 1,
    source: 'Reuters',
    time: '14m ago',
    headline: 'Fed Chair signals two rate cuts possible in 2026 if inflation cools further',
    category: 'Fed+Rates',
    sentiment: 'bullish',
    tags: ['Fed', 'rates'],
  },
  {
    id: 2,
    source: 'Bloomberg',
    time: '38m ago',
    headline: 'Bitcoin ETF inflows hit $1.2B this week, BlackRock leads with $780M',
    category: 'Bitcoin',
    sentiment: 'bullish',
    tags: ['BTC', 'ETF'],
  },
  {
    id: 3,
    source: 'CoinDesk',
    time: '1h ago',
    headline: 'Ethereum Layer-2 TVL surpasses $80B as Arbitrum and Base see record activity',
    category: 'Altcoins',
    sentiment: 'bullish',
    tags: ['ETH', 'L2'],
  },
  {
    id: 4,
    source: 'WSJ',
    time: '2h ago',
    headline: 'Dollar weakens as China signals further monetary easing to combat slowdown',
    category: 'US Dollar',
    sentiment: 'bearish',
    tags: ['DXY', 'PBoC'],
  },
  {
    id: 5,
    source: 'Glassnode',
    time: '3h ago',
    headline: 'Long-term holders continue accumulation — LTH supply reaches 3-year high',
    category: 'On-chain',
    sentiment: 'bullish',
    tags: ['on-chain', 'LTH'],
  },
  {
    id: 6,
    source: 'FT',
    time: '4h ago',
    headline: 'US credit spreads widen as regional bank concerns resurface',
    category: 'Fed+Rates',
    sentiment: 'bearish',
    tags: ['credit', 'banks'],
  },
  {
    id: 7,
    source: 'The Block',
    time: '5h ago',
    headline: 'Hyperliquid perp DEX volume crosses $10B in single day for first time',
    category: 'Altcoins',
    sentiment: 'bullish',
    tags: ['HYPE', 'DeFi'],
  },
  {
    id: 8,
    source: 'CryptoQuant',
    time: '6h ago',
    headline: 'Exchange BTC reserves fall to 5-year low — structural supply squeeze forming',
    category: 'On-chain',
    sentiment: 'bullish',
    tags: ['on-chain', 'supply'],
  },
  {
    id: 9,
    source: 'Axios',
    time: '8h ago',
    headline: 'Global M2 growth accelerates to 6.8% YoY driven by ECB and PBoC liquidity',
    category: 'Fed+Rates',
    sentiment: 'bullish',
    tags: ['M2', 'macro'],
  },
  {
    id: 10,
    source: 'Decrypt',
    time: '10h ago',
    headline: 'Solana network processes record 12,000 TPS during memecoin frenzy',
    category: 'Altcoins',
    sentiment: 'neutral',
    tags: ['SOL', 'TPS'],
  },
];

export const tweets = [
  {
    id: 1,
    handle: '@PlanBTC',
    initials: 'PB',
    time: '12m',
    text: 'MVRV just crossed 2.0 again. Historically this is the beginning of the mid-cycle run, not the end. #Bitcoin',
    tags: ['BTC', 'on-chain'],
    engagement: 4200,
    category: 'BTC',
  },
  {
    id: 2,
    handle: '@FedGuy12',
    initials: 'FG',
    time: '45m',
    text: 'Two-year rates pricing 3.5 cuts this year. Market is way ahead of FOMC. Expect pushback at next presser.',
    tags: ['Fed', 'rates'],
    engagement: 8900,
    category: 'Fed',
  },
  {
    id: 3,
    handle: '@RaoulPal',
    initials: 'RP',
    time: '1h',
    text: 'Global M2 now at new ATH. With a 90-day lag this is jet fuel for risk assets into Q3. ETH and SOL especially positioned.',
    tags: ['macro', 'M2'],
    engagement: 12400,
    category: 'Fed',
  },
  {
    id: 4,
    handle: '@WClementeIII',
    initials: 'WC',
    time: '2h',
    text: 'LTH supply at 3-year high + exchange reserves at 5-year low. This setup has preceded every major bull leg. Patient hands winning.',
    tags: ['BTC', 'LTH'],
    engagement: 6700,
    category: 'BTC',
  },
  {
    id: 5,
    handle: '@CryptoHayes',
    initials: 'CH',
    time: '3h',
    text: 'DXY breaking down = bitcoin breaking up. Simple macro. PBoC easing + Fed pivot = dollar toast. Accumulate accordingly.',
    tags: ['DXY', 'macro'],
    engagement: 19200,
    category: 'USD',
  },
  {
    id: 6,
    handle: '@AltcoinSherpa',
    initials: 'AS',
    time: '4h',
    text: 'SOL weekly RSI just hit 55 after cooling off from 80. Still room to run. TPS hitting ATH. Ecosystem humming.',
    tags: ['SOL', 'alts'],
    engagement: 3100,
    category: 'Alts',
  },
  {
    id: 7,
    handle: '@jcliff42',
    initials: 'JC',
    time: '6h',
    text: 'Hyperliquid hitting $10B daily volume from a standing start two years ago is one of the most impressive stats in crypto history.',
    tags: ['HYPE', 'DeFi'],
    engagement: 5400,
    category: 'Alts',
  },
  {
    id: 8,
    handle: '@GlassNode',
    initials: 'GN',
    time: '8h',
    text: '📊 Weekly On-chain: SOPR crossed above 1.0 and holding. Sellers now in profit on average. Historically precedes sustained price appreciation.',
    tags: ['on-chain', 'SOPR'],
    engagement: 7800,
    category: 'BTC',
  },
];
