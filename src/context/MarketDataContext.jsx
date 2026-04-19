import { createContext, useContext, useEffect, useState } from 'react';
import {
  btcPrice   as mockBtcPrice,
  fearGreed  as mockFearGreed,
  rsiWeekly  as mockRsiWeekly,
  altcoins   as mockAltcoins,
  blockStats as mockBlockStats,
  // pass-through mocks that have no free API equivalent
  compositeSignals, zscoreIndicators,
  globalM2, mvrv, nupl, soprLTH, puellMultiple, piCycleTop,
  exchangeNetFlow, lthSupply, feeRevenue, activeAddresses,
  creditSpreads, us10y, pbocM2, fedBalanceSheet,
  fundingRate, putCallSkew, yieldCurve, dxy,
  twitterSentiment, googleTrends,
  newsItems, tweets,
} from '../data/mockData';
import {
  fetchBtcHistory,
  fetchCoinPrices,
  fetchFearGreedHistory,
  fetchBlockStats,
  fetchFredMacro,
  calcRsiFromPrices,
} from '../data/api';

const FRED_KEY = import.meta.env.VITE_FRED_API_KEY ?? '';

const MarketDataContext = createContext(null);

// Initial state = mock data so UI renders immediately
const MOCK_STATE = {
  btcPrice: mockBtcPrice,
  fearGreed: mockFearGreed,
  rsiWeekly: mockRsiWeekly,
  altcoins: mockAltcoins,
  blockStats: mockBlockStats,
  // pass-through mocks
  compositeSignals, zscoreIndicators,
  globalM2, mvrv, nupl, soprLTH, puellMultiple, piCycleTop,
  exchangeNetFlow, lthSupply, feeRevenue, activeAddresses,
  creditSpreads, us10y, pbocM2, fedBalanceSheet,
  fundingRate, putCallSkew, yieldCurve, dxy,
  twitterSentiment, googleTrends,
  newsItems, tweets,
};

export function MarketDataProvider({ children }) {
  const [data,    setData]    = useState(MOCK_STATE);
  const [loading, setLoading] = useState(true);
  const [errors,  setErrors]  = useState({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const errs = {};
      const patch = {};

      // BTC price history + derived RSI
      try {
        const btcHistory = await fetchBtcHistory(730);
        if (btcHistory.length > 0) {
          patch.btcPrice = btcHistory;
          patch.rsiWeekly = calcRsiFromPrices(btcHistory);
        }
      } catch (e) {
        errs.btcPrice = e.message;
      }

      // Fear & Greed history
      try {
        const fg = await fetchFearGreedHistory(730);
        if (fg.length > 0) patch.fearGreed = fg;
      } catch (e) {
        errs.fearGreed = e.message;
      }

      // Current coin prices → merge into altcoins keeping mock zscores/sparklines
      try {
        const prices = await fetchCoinPrices();
        patch.altcoins = Object.fromEntries(
          Object.entries(mockAltcoins).map(([ticker, mock]) => [
            ticker,
            {
              ...mock,
              price:     prices[ticker]?.price     ?? mock.price,
              change24h: prices[ticker]?.change24h  ?? mock.change24h,
            },
          ])
        );
        // Also update btcPrice latest value for sparkline continuity
        if (prices.BTC?.price && patch.btcPrice) {
          const arr = patch.btcPrice;
          arr[arr.length - 1] = { ...arr[arr.length - 1], price: prices.BTC.price };
        }
      } catch (e) {
        errs.altcoins = e.message;
      }

      // Block / mempool stats
      try {
        const bs = await fetchBlockStats();
        patch.blockStats = bs;
      } catch (e) {
        errs.blockStats = e.message;
      }

      // FRED macro series (requires VITE_FRED_API_KEY in .env.local)
      if (FRED_KEY) {
        try {
          const btcDates  = (patch.btcPrice ?? mockBtcPrice).map(d => d.date);
          const startDate = btcDates[0];
          const fred      = await fetchFredMacro(FRED_KEY, startDate, btcDates);
          if (fred.yieldCurve)      patch.yieldCurve      = fred.yieldCurve;
          if (fred.dxy)             patch.dxy             = fred.dxy;
          if (fred.fedBalanceSheet) patch.fedBalanceSheet = fred.fedBalanceSheet;
          if (fred.us10y)           patch.us10y           = fred.us10y;
          if (fred.creditSpreads)   patch.creditSpreads   = fred.creditSpreads;
        } catch (e) {
          errs.fred = e.message;
        }
      }

      if (!cancelled) {
        setData(prev => ({ ...prev, ...patch }));
        setErrors(errs);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <MarketDataContext.Provider value={{ data, loading, errors }}>
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const ctx = useContext(MarketDataContext);
  if (!ctx) throw new Error('useMarketData must be used inside MarketDataProvider');
  return ctx;
}
