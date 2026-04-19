# SignalStack — Claude Code Brief

## What we're building

A crypto investing signal dashboard called **SignalStack**. It's a React + Vite app
deployed on GitHub Pages. The core idea: every indicator (on-chain, macro, technical,
sentiment) gets **z-scored** to a common scale so they're all comparable. The dashboard
aggregates them into a composite buy/sell signal.

## Tech stack

- **React + Vite** (no SSR needed, static output for GitHub Pages)
- **Recharts** for all charts (line, bar, area, gauge)
- **Tailwind CSS** for layout and utilities
- **React Router** for page navigation
- **GitHub Pages** for hosting (deploy from `/dist` on `main` branch)

## App structure

```
src/
  pages/
    Dashboard.jsx       ← composite signal overview (main landing page)
    OnChain.jsx         ← Bitcoin on-chain metrics
    Macro.jsx           ← global liquidity, bonds, DXY
    News.jsx            ← news feed + X/Twitter feed
    Altcoins.jsx        ← ETH, SOL, HYPE watchlist
    Alerts.jsx          ← alert configuration
  components/
    Nav.jsx             ← top navigation bar
    ZScoreTable.jsx     ← reusable z-score heatmap table
    ZScoreGauge.jsx     ← arc gauge for individual z-scores
    CoinCard.jsx        ← altcoin price + signal card
    NewsCard.jsx        ← news headline card with sentiment tag
    TweetCard.jsx       ← X/Twitter post card
    ChartPanel.jsx      ← wrapper for any Recharts chart
    SignalBadge.jsx     ← Buy / Neutral / Caution badge
    AlertStrip.jsx      ← top-of-page alert banner
    BlockStats.jsx      ← BTC block height, difficulty, hashrate, mempool
  data/
    mockData.js         ← ALL data lives here as static mock JSON for now
                           (real API calls get wired in later — keep this clean)
  hooks/
    useZScore.js        ← utility: calculates z-score from array of values
  App.jsx
  main.jsx
```

## Pages in detail

### Dashboard.jsx (main page)
- Row of 4 composite signal cards: Overall signal, Global liquidity z-score,
  Bond stress z-score, BTC cycle position
- 3 arc gauges side by side: Fear & Greed index, Global M2 liquidity, MVRV z-score
- ZScoreTable with all indicators (see indicator list below)
- 2x2 grid of mini chart panels:
  - BTC price with MVRV bands (colored background zones)
  - Global M2 (90d lag) vs BTC price (two lines)
  - RSI weekly z-score ribbon (with overbought/oversold zones)
  - Sentiment composite line

### OnChain.jsx
Indicators: MVRV ratio, NUPL, SOPR (LTH + STH), Realized cap bands,
Puell multiple, Pi Cycle Top distance, Exchange net flow, LTH supply %,
Fee revenue z-score, Active address momentum.
Each gets its own ChartPanel + ZScoreTable row.

### Macro.jsx
Indicators: Global M2 (Fed+ECB+PBoC+BoJ), US10Y yield, 2s10s yield curve spread,
DXY index, Credit spreads (HY vs IG), PBoC M2 growth, Fed balance sheet.
Key chart: M2 with 90-day lag overlaid on BTC price — this is the flagship macro chart.

### News.jsx
- Filter tabs: All / Fed+Rates / US Dollar / Bitcoin / Altcoins / On-chain
- Left column: news headlines (source, time, headline, category tags, sentiment label)
- Right column: X/Twitter curated feed
  - Sub-tabs: All / Fed / USD / BTC / Alts
  - Each tweet: avatar initials, handle, time, text, tags, engagement count
- Alert strip at top if Fed speaker scheduled

### Altcoins.jsx
Watchlist: BTC, ETH, SOL, HYPE (Hyperliquid) — easily extensible array
Each CoinCard shows: price, 24h change, weekly RSI, a relevant on-chain or
network stat (MVRV for BTC, ETH/BTC ratio for ETH, TPS for SOL, perp volume for HYPE),
a mini sparkline, and a signal badge.
Below cards: comparison table of all coins' z-scores side by side.

### Alerts.jsx
- List of configured alerts with threshold, condition, notification method
- Form to add new alert: pick indicator, set z-score threshold, notification type

## Z-score indicator list (ZScoreTable)

| Indicator | Category | Source (mock → real) |
|---|---|---|
| MVRV ratio | On-chain | Glassnode |
| NUPL | On-chain | Glassnode |
| SOPR (LTH) | On-chain | Glassnode |
| Puell multiple | On-chain | Glassnode |
| Pi cycle top distance | On-chain | checkonchain.com |
| Exchange net flow | On-chain | CryptoQuant |
| RSI (weekly) | Technical | CoinGecko OHLC |
| Funding rate (perps) | Technical | Coinglass |
| Options put/call skew | Technical | Deribit |
| Global M2 (90d lag) | Macro | FRED API |
| Bond yield spread (2s10s) | Macro | FRED API |
| DXY z-score | Macro | FRED API |
| Fear & Greed index | Sentiment | alternative.me |
| Twitter sentiment | Sentiment | X API |
| Google Trends (bitcoin) | Sentiment | SerpAPI |

## ZScoreTable component spec

The most important reusable component. Props:
```js
<ZScoreTable
  indicators={[
    { name: 'MVRV ratio', category: 'on-chain', zscore: 1.8, signal: 'buy' },
    ...
  ]}
  showCategories={true}   // group rows by category with subheaders
/>
```

Each row: indicator name | horizontal bar centered at 0 (red left, green right) |
z-score value (colored) | signal badge (Buy/Neutral/Caution).
Bar scale: -3σ to +3σ. Color: green for positive, red for negative, amber for ±0.5.
Signal thresholds: Buy > +1.0σ, Caution < -1.0σ, Neutral in between.

## useZScore hook

```js
// src/hooks/useZScore.js
export function calcZScore(values) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = Math.sqrt(values.map(v => (v - mean) ** 2)
    .reduce((a, b) => a + b, 0) / values.length);
  return std === 0 ? 0 : (values[values.length - 1] - mean) / std;
}

export function useZScore(historicalValues) {
  return useMemo(() => calcZScore(historicalValues), [historicalValues]);
}
```

## mockData.js structure

Keep all mock data here. Real API integration happens later by replacing
each data fetch in this file. Structure:

```js
export const btcPrice = [...];           // {date, price} array, ~2 years daily
export const mvrv = [...];               // {date, value}
export const nupl = [...];               // {date, value}
export const globalM2 = [...];           // {date, value} — lag by 90d in Macro chart
export const fearGreed = [...];          // {date, value} 0-100
export const yieldCurve = [...];         // {date, spread}
export const altcoins = {
  BTC: { price: 84210, change24h: 2.4, rsi1w: 61, mvrv: 2.1, signal: 'accumulate' },
  ETH: { price: 1584,  change24h: -0.8, rsi1w: 44, ethbtc: 0.0188, signal: 'watch' },
  SOL: { price: 131.4, change24h: 3.1, rsi1w: 55, tps: 3241, signal: 'accumulate' },
  HYPE: { price: 14.82, change24h: 5.7, rsi1w: 67, perpVol: '4.1B', signal: 'watch' },
};
export const blockStats = {
  height: 893441, difficulty: '109.78T', hashrate: '798 EH/s',
  nextDiffAdj: '+2.1%', mempoolTx: 84000, avgFee: '18 sat/vb',
};
export const newsItems = [...];          // array of headline objects
export const tweets = [...];             // array of tweet objects
export const zscoreIndicators = [...];   // full indicator list with current z-scores
```

## Aesthetic direction

Terminal / data-dense. Think Bloomberg terminal meets modern design system.
- Dark theme by default with a light mode toggle
- Monospaced font for numbers (e.g. JetBrains Mono or IBM Plex Mono)
- Clean sans-serif for UI (e.g. DM Sans or Geist)
- Color palette: dark backgrounds, green for bullish signals, red/coral for bearish,
  amber for neutral — consistent with financial convention
- Tight information density — this is a pro tool, not a consumer app
- Subtle grid lines, no decorative gradients

## GitHub Pages deployment

```json
// vite.config.js — set base to your repo name
export default defineConfig({
  base: '/signal-stack/',   // change to your repo name
  plugins: [react()],
})
```

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## What to build first (suggested order)

1. Vite + React + Tailwind scaffold + Router setup
2. mockData.js with realistic fake data for all indicators
3. Nav.jsx + App.jsx with routing
4. ZScoreTable.jsx (most reusable, unblocks everything else)
5. Dashboard.jsx using ZScoreTable + placeholder charts
6. Recharts integration — ChartPanel.jsx with the M2 vs BTC chart
7. ZScoreGauge.jsx (arc gauges)
8. CoinCard.jsx + Altcoins.jsx
9. NewsCard.jsx + TweetCard.jsx + News.jsx
10. BlockStats.jsx + wire into Dashboard
11. GitHub Actions deploy workflow
12. README with API integration guide for going live
