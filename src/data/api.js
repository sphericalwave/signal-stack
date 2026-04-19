const COINGECKO = 'https://api.coingecko.com/api/v3';
const MEMPOOL   = 'https://mempool.space/api';
const FNG       = 'https://api.alternative.me/fng';

// BTC daily price history → [{date: 'YYYY-MM-DD', price: number}]
export async function fetchBtcHistory(days = 730) {
  const r = await fetch(`${COINGECKO}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`);
  if (!r.ok) throw new Error(`CoinGecko ${r.status}`);
  const { prices } = await r.json();
  return prices.map(([ts, price]) => ({
    date:  new Date(ts).toISOString().slice(0, 10),
    price: Math.round(price),
  }));
}

// Current prices + 24h change → {BTC: {price, change24h}, ETH: ..., SOL: ..., HYPE: ...}
export async function fetchCoinPrices() {
  const ids = 'bitcoin,ethereum,solana,hyperliquid';
  const r = await fetch(
    `${COINGECKO}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
  );
  if (!r.ok) throw new Error(`CoinGecko ${r.status}`);
  const d = await r.json();
  return {
    BTC:  { price: d.bitcoin?.usd,     change24h: +(d.bitcoin?.usd_24h_change     ?? 0).toFixed(2) },
    ETH:  { price: d.ethereum?.usd,    change24h: +(d.ethereum?.usd_24h_change    ?? 0).toFixed(2) },
    SOL:  { price: d.solana?.usd,      change24h: +(d.solana?.usd_24h_change      ?? 0).toFixed(2) },
    HYPE: { price: d.hyperliquid?.usd, change24h: +(d.hyperliquid?.usd_24h_change ?? 0).toFixed(2) },
  };
}

// Fear & Greed index history → [{date: 'YYYY-MM-DD', value: number}]
export async function fetchFearGreedHistory(limit = 730) {
  const r = await fetch(`${FNG}/?limit=${limit}&format=json`);
  if (!r.ok) throw new Error(`FNG ${r.status}`);
  const { data } = await r.json();
  return [...data].reverse().map(d => ({
    date:  new Date(Number(d.timestamp) * 1000).toISOString().slice(0, 10),
    value: Number(d.value),
  }));
}

// Mempool + block stats → {height, difficulty, hashrate, nextDiffAdj, mempoolTx, avgFee}
export async function fetchBlockStats() {
  const [heightR, mempoolR, feeR, diffR, hashR] = await Promise.all([
    fetch(`${MEMPOOL}/blocks/tip/height`),
    fetch(`${MEMPOOL}/mempool`),
    fetch(`${MEMPOOL}/v1/fees/recommended`),
    fetch(`${MEMPOOL}/v1/difficulty-adjustment`),
    fetch(`${MEMPOOL}/v1/mining/hashrate/3m`),
  ]);

  const height  = await heightR.json();
  const mempool = await mempoolR.json();
  const fees    = await feeR.json();
  const diff    = await diffR.json();
  const hash    = await hashR.json();

  const hashrateEH = ((hash.currentHashrate ?? 0) / 1e18).toFixed(0);
  const adjPct     = diff.difficultyChange ?? 0;
  const diffT      = formatDifficulty(diff.currentDifficulty ?? 0);

  return {
    height,
    difficulty:  diffT,
    hashrate:    `${hashrateEH} EH/s`,
    nextDiffAdj: `${adjPct >= 0 ? '+' : ''}${adjPct.toFixed(1)}%`,
    mempoolTx:   mempool.count ?? 0,
    avgFee:      `${fees.hourFee ?? '—'} sat/vb`,
  };
}

function formatDifficulty(d) {
  if (d >= 1e12) return `${(d / 1e12).toFixed(2)}T`;
  if (d >= 1e9)  return `${(d / 1e9).toFixed(2)}G`;
  return String(d);
}

// RSI(14) calculated from [{date, price}] daily data → [{date, value}]
export function calcRsiFromPrices(priceData, period = 14) {
  const prices = priceData.map(d => d.price);
  const out    = priceData.map(d => ({ date: d.date, value: 50 })); // default fill

  let avgGain = 0, avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) avgGain += diff; else avgLoss -= diff;
  }
  avgGain /= period;
  avgLoss /= period;

  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
    const rs  = avgLoss === 0 ? Infinity : avgGain / avgLoss;
    out[i].value = parseFloat((100 - 100 / (1 + rs)).toFixed(1));
  }
  return out;
}
