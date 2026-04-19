const COINGECKO = 'https://api.coingecko.com/api/v3';
const MEMPOOL   = 'https://mempool.space/api';
const FNG       = 'https://api.alternative.me/fng';
const FRED      = 'https://api.stlouisfed.org/fred/series/observations';

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

// ── FRED ─────────────────────────────────────────────────────────────────────

function fredUrl(seriesId, apiKey, startDate) {
  return `${FRED}?series_id=${seriesId}&api_key=${apiKey}&file_type=json&observation_start=${startDate}&sort_order=asc`;
}

async function fredSeries(seriesId, apiKey, startDate) {
  const r = await fetch(fredUrl(seriesId, apiKey, startDate));
  if (!r.ok) throw new Error(`FRED ${seriesId} ${r.status}`);
  const { observations } = await r.json();
  // Filter out missing values (".")
  return observations
    .filter(o => o.value !== '.')
    .map(o => ({ date: o.date, value: parseFloat(o.value) }));
}

// Forward-fill sparse (weekly/monthly) series to match a daily date array
function forwardFill(sparse, dailyDates) {
  const map = new Map(sparse.map(d => [d.date, d.value]));
  let last = sparse[0]?.value ?? 0;
  return dailyDates.map(date => {
    if (map.has(date)) last = map.get(date);
    return { date, value: last };
  });
}

// Yield curve 2s10s spread → [{date, spread}] in basis points
export async function fetchYieldCurve(apiKey, startDate) {
  const data = await fredSeries('T10Y2Y', apiKey, startDate);
  // T10Y2Y is already 10Y-2Y in percentage points; convert to bps
  return data.map(d => ({ date: d.date, spread: parseFloat((d.value * 100).toFixed(1)) }));
}

// Broad US Dollar Index (DTWEXBGS) → [{date, value}]
// Weekly series — forward-filled to daily
export async function fetchDxy(apiKey, startDate, dailyDates) {
  const sparse = await fredSeries('DTWEXBGS', apiKey, startDate);
  return forwardFill(sparse, dailyDates);
}

// Fed balance sheet assets (WALCL, weekly, millions) → [{date, value}] in trillions
export async function fetchFedBalanceSheet(apiKey, startDate, dailyDates) {
  const sparse = await fredSeries('WALCL', apiKey, startDate);
  const inTrillions = sparse.map(d => ({ date: d.date, value: parseFloat((d.value / 1e6).toFixed(3)) }));
  return forwardFill(inTrillions, dailyDates);
}

// US 10Y yield (GS10, daily) → [{date, value}]
export async function fetchUs10y(apiKey, startDate) {
  return fredSeries('GS10', apiKey, startDate);
}

// Credit spreads HY − IG (bps) → [{date, value}]
export async function fetchCreditSpreads(apiKey, startDate) {
  const [hy, ig] = await Promise.all([
    fredSeries('BAMLH0A0HYM2', apiKey, startDate),
    fredSeries('BAMLC0A0CM',   apiKey, startDate),
  ]);
  const igMap = new Map(ig.map(d => [d.date, d.value]));
  return hy
    .filter(d => igMap.has(d.date))
    .map(d => ({ date: d.date, value: parseFloat((d.value - igMap.get(d.date)).toFixed(1)) }));
}

// Fetch all FRED macro series in parallel
// dailyDates: string[] of 'YYYY-MM-DD' matching your btcPrice array — used to forward-fill weekly data
export async function fetchFredMacro(apiKey, startDate, dailyDates) {
  const [yieldCurve, dxy, fedBalanceSheet, us10y, creditSpreads] = await Promise.allSettled([
    fetchYieldCurve(apiKey, startDate),
    fetchDxy(apiKey, startDate, dailyDates),
    fetchFedBalanceSheet(apiKey, startDate, dailyDates),
    fetchUs10y(apiKey, startDate),
    fetchCreditSpreads(apiKey, startDate),
  ]);

  return {
    yieldCurve:      yieldCurve.status      === 'fulfilled' ? yieldCurve.value      : null,
    dxy:             dxy.status             === 'fulfilled' ? dxy.value             : null,
    fedBalanceSheet: fedBalanceSheet.status === 'fulfilled' ? fedBalanceSheet.value : null,
    us10y:           us10y.status           === 'fulfilled' ? us10y.value           : null,
    creditSpreads:   creditSpreads.status   === 'fulfilled' ? creditSpreads.value   : null,
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
