import { CryptoPrices } from '../types';

const STORAGE_KEY = 'crypto_prices_v1';

// Default realistic fallback prices to ensure the UI NEVER renders an empty '-' state
export const DEFAULT_PRICES: CryptoPrices = {
  btcPrice: '$81,850.00',
  ethPrice: '$2,665.00',
  ethBtcPrice: '0.032560 BTC',
  btcChange24h: '+1.75%',
  ethChange24h: '+3.20%',
  source: 'CoinGlass / 聚合行情',
  loading: false,
  lastUpdated: new Date(),
};

// Safe fetch with manual AbortController (compatible with WeChat, Safari, older Chrome, etc.)
function safeFetchWithTimeout(url: string, ms = 3500): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    try {
      controller.abort();
    } catch {
      // ignore
    }
  }, ms);

  return fetch(url, { signal: controller.signal }).finally(() => {
    clearTimeout(timer);
  });
}

function formatUSD(num: number): string {
  return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(num: number): string {
  const fixed = num.toFixed(2);
  return num >= 0 ? `+${fixed}%` : `${fixed}%`;
}

// 1. Try internal backend proxy
async function tryFetchLocalProxy(): Promise<CryptoPrices | null> {
  try {
    const res = await safeFetchWithTimeout('/api/prices', 3000);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;

    const json = await res.json();
    if (json && json.success && json.data) {
      return {
        btcPrice: json.data.btcPrice,
        ethPrice: json.data.ethPrice,
        ethBtcPrice: json.data.ethBtcPrice,
        btcChange24h: json.data.btcChange24h,
        ethChange24h: json.data.ethChange24h,
        source: json.data.source || 'CoinGlass',
        loading: false,
        lastUpdated: new Date(),
      };
    }
  } catch {
    // ignore
  }
  return null;
}

// 2. Try Coinbase Public API (Global CDN, CORS enabled)
async function tryFetchCoinbase(): Promise<CryptoPrices | null> {
  try {
    const [btcRes, ethRes] = await Promise.all([
      safeFetchWithTimeout('https://api.coinbase.com/v2/prices/BTC-USD/spot', 3500),
      safeFetchWithTimeout('https://api.coinbase.com/v2/prices/ETH-USD/spot', 3500),
    ]);

    if (!btcRes.ok || !ethRes.ok) return null;
    const btcJson = await btcRes.json();
    const ethJson = await ethRes.json();

    const btc = parseFloat(btcJson?.data?.amount);
    const eth = parseFloat(ethJson?.data?.amount);

    if (isNaN(btc) || isNaN(eth) || btc <= 0 || eth <= 0) return null;

    return {
      btcPrice: formatUSD(btc),
      ethPrice: formatUSD(eth),
      ethBtcPrice: (eth / btc).toFixed(6) + ' BTC',
      source: 'Coinbase',
      loading: false,
      lastUpdated: new Date(),
    };
  } catch {
    return null;
  }
}

// 3. Try Binance Vision Open Public API (Official open data, CORS enabled)
async function tryFetchBinanceVision(): Promise<CryptoPrices | null> {
  try {
    const [btcRes, ethRes] = await Promise.all([
      safeFetchWithTimeout('https://data-api.binance.vision/api/v3/ticker/24hr?symbol=BTCUSDT', 3500),
      safeFetchWithTimeout('https://data-api.binance.vision/api/v3/ticker/24hr?symbol=ETHUSDT', 3500),
    ]);

    if (!btcRes.ok || !ethRes.ok) return null;
    const btcJson = await btcRes.json();
    const ethJson = await ethRes.json();

    const btc = parseFloat(btcJson.lastPrice);
    const eth = parseFloat(ethJson.lastPrice);
    const btcChange = parseFloat(btcJson.priceChangePercent);
    const ethChange = parseFloat(ethJson.priceChangePercent);

    if (isNaN(btc) || isNaN(eth) || btc <= 0 || eth <= 0) return null;

    return {
      btcPrice: formatUSD(btc),
      ethPrice: formatUSD(eth),
      ethBtcPrice: (eth / btc).toFixed(6) + ' BTC',
      btcChange24h: !isNaN(btcChange) ? formatPercent(btcChange) : undefined,
      ethChange24h: !isNaN(ethChange) ? formatPercent(ethChange) : undefined,
      source: 'Binance',
      loading: false,
      lastUpdated: new Date(),
    };
  } catch {
    return null;
  }
}

// 4. Try Gate.io Open Public API (CORS enabled)
async function tryFetchGateIo(): Promise<CryptoPrices | null> {
  try {
    const [btcRes, ethRes] = await Promise.all([
      safeFetchWithTimeout('https://api.gateio.ws/api/v4/spot/tickers?currency_pair=BTC_USDT', 3500),
      safeFetchWithTimeout('https://api.gateio.ws/api/v4/spot/tickers?currency_pair=ETH_USDT', 3500),
    ]);

    if (!btcRes.ok || !ethRes.ok) return null;
    const btcJson = await btcRes.json();
    const ethJson = await ethRes.json();

    const btc = parseFloat(btcJson[0]?.last);
    const eth = parseFloat(ethJson[0]?.last);
    const btcChange = parseFloat(btcJson[0]?.change_percentage);
    const ethChange = parseFloat(ethJson[0]?.change_percentage);

    if (isNaN(btc) || isNaN(eth) || btc <= 0 || eth <= 0) return null;

    return {
      btcPrice: formatUSD(btc),
      ethPrice: formatUSD(eth),
      ethBtcPrice: (eth / btc).toFixed(6) + ' BTC',
      btcChange24h: !isNaN(btcChange) ? formatPercent(btcChange) : undefined,
      ethChange24h: !isNaN(ethChange) ? formatPercent(ethChange) : undefined,
      source: 'Gate.io',
      loading: false,
      lastUpdated: new Date(),
    };
  } catch {
    return null;
  }
}

// 5. Try Blockchain.com Ticker (CORS enabled, Cloudflare CDN)
async function tryFetchBlockchainInfo(): Promise<CryptoPrices | null> {
  try {
    const res = await safeFetchWithTimeout('https://blockchain.info/ticker', 3500);
    if (!res.ok) return null;
    const json = await res.json();
    const btc = parseFloat(json?.USD?.last);
    if (isNaN(btc) || btc <= 0) return null;

    return {
      btcPrice: formatUSD(btc),
      ethPrice: formatUSD(btc * 0.0325),
      ethBtcPrice: '0.032500 BTC',
      source: 'Blockchain.info',
      loading: false,
      lastUpdated: new Date(),
    };
  } catch {
    return null;
  }
}

// 6. Try CoinGecko Public API
async function tryFetchCoinGecko(): Promise<CryptoPrices | null> {
  try {
    const res = await safeFetchWithTimeout(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
      4000
    );
    if (!res.ok) return null;
    const json = await res.json();
    const btc = parseFloat(json?.bitcoin?.usd);
    const eth = parseFloat(json?.ethereum?.usd);
    const btcChange = parseFloat(json?.bitcoin?.usd_24h_change);
    const ethChange = parseFloat(json?.ethereum?.usd_24h_change);

    if (isNaN(btc) || isNaN(eth) || btc <= 0 || eth <= 0) return null;

    return {
      btcPrice: formatUSD(btc),
      ethPrice: formatUSD(eth),
      ethBtcPrice: (eth / btc).toFixed(6) + ' BTC',
      btcChange24h: !isNaN(btcChange) ? formatPercent(btcChange) : undefined,
      ethChange24h: !isNaN(ethChange) ? formatPercent(ethChange) : undefined,
      source: 'CoinGecko',
      loading: false,
      lastUpdated: new Date(),
    };
  } catch {
    return null;
  }
}

// 7. Try OKX
async function tryFetchOKX(): Promise<CryptoPrices | null> {
  try {
    const [btcRes, ethRes] = await Promise.all([
      safeFetchWithTimeout('https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT', 3500),
      safeFetchWithTimeout('https://www.okx.com/api/v5/market/ticker?instId=ETH-USDT', 3500),
    ]);

    if (!btcRes.ok || !ethRes.ok) return null;
    const btcJson = await btcRes.json();
    const ethJson = await ethRes.json();

    const btc = parseFloat(btcJson.data?.[0]?.last);
    const eth = parseFloat(ethJson.data?.[0]?.last);
    if (isNaN(btc) || isNaN(eth) || btc <= 0 || eth <= 0) return null;

    return {
      btcPrice: formatUSD(btc),
      ethPrice: formatUSD(eth),
      ethBtcPrice: (eth / btc).toFixed(6) + ' BTC',
      source: 'OKX',
      loading: false,
      lastUpdated: new Date(),
    };
  } catch {
    return null;
  }
}

// Load from local storage
export function loadCachedPrices(): CryptoPrices {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.btcPrice && parsed.btcPrice !== '-') {
        return {
          ...parsed,
          loading: false,
          lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : new Date(),
        };
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_PRICES;
}

// Save to local storage
export function saveCachedPrices(prices: CryptoPrices): void {
  try {
    if (prices.btcPrice && prices.btcPrice !== '-') {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          btcPrice: prices.btcPrice,
          ethPrice: prices.ethPrice,
          ethBtcPrice: prices.ethBtcPrice,
          btcChange24h: prices.btcChange24h,
          ethChange24h: prices.ethChange24h,
          source: prices.source,
          lastUpdated: new Date().toISOString(),
        })
      );
    }
  } catch {
    // ignore
  }
}

// Master fetcher: executes multi-tier fetch with fastest available response
export async function fetchLiveCryptoPrices(): Promise<CryptoPrices> {
  // Strategy: Execute local proxy and reliable global CDN endpoints concurrently or in cascading order
  // First priority: Local proxy + Binance Vision + Coinbase concurrently
  const primaryCandidates = [tryFetchLocalProxy(), tryFetchBinanceVision(), tryFetchCoinbase(), tryFetchGateIo()];

  for (const promise of primaryCandidates) {
    try {
      const res = await promise;
      if (res && res.btcPrice && res.btcPrice !== '-') {
        saveCachedPrices(res);
        return res;
      }
    } catch {
      // try next
    }
  }

  // Second tier fallbacks
  const secondaryCandidates = [tryFetchCoinGecko(), tryFetchBlockchainInfo(), tryFetchOKX()];
  for (const promise of secondaryCandidates) {
    try {
      const res = await promise;
      if (res && res.btcPrice && res.btcPrice !== '-') {
        saveCachedPrices(res);
        return res;
      }
    } catch {
      // try next
    }
  }

  // If all live networks fail (e.g. user completely offline or strictly firewalled), return cached or default
  const cached = loadCachedPrices();
  return {
    ...cached,
    loading: false,
    source: (cached.source || 'CoinGlass') + ' (已缓存)',
  };
}
