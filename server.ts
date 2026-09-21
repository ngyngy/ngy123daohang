import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface PriceData {
  btcPrice: string;
  ethPrice: string;
  ethBtcPrice: string;
  btcChange24h?: string;
  ethChange24h?: string;
  source: string;
  updatedAt: string;
}

let cachedPriceData: PriceData | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 10_000; // 10 seconds cache

async function fetchFromOKX(): Promise<PriceData | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const [btcRes, ethRes] = await Promise.all([
      fetch("https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT", { signal: controller.signal }),
      fetch("https://www.okx.com/api/v5/market/ticker?instId=ETH-USDT", { signal: controller.signal }),
    ]);
    if (!btcRes.ok || !ethRes.ok) return null;
    const btcJson = await btcRes.json();
    const ethJson = await ethRes.json();

    const btcItem = btcJson.data?.[0];
    const ethItem = ethJson.data?.[0];
    if (!btcItem || !ethItem) return null;

    const btc = parseFloat(btcItem.last);
    const eth = parseFloat(ethItem.last);
    const btcOpen = parseFloat(btcItem.sodUtc0 || btcItem.open24h);
    const ethOpen = parseFloat(ethItem.sodUtc0 || ethItem.open24h);

    const btcChange = btcOpen ? (((btc - btcOpen) / btcOpen) * 100).toFixed(2) : undefined;
    const ethChange = ethOpen ? (((eth - ethOpen) / ethOpen) * 100).toFixed(2) : undefined;

    return {
      btcPrice: "$" + btc.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ethPrice: "$" + eth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ethBtcPrice: (eth / btc).toFixed(6) + " BTC",
      btcChange24h: btcChange ? (Number(btcChange) >= 0 ? `+${btcChange}%` : `${btcChange}%`) : undefined,
      ethChange24h: ethChange ? (Number(ethChange) >= 0 ? `+${ethChange}%` : `${ethChange}%`) : undefined,
      source: "CoinGlass / OKX",
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchFromBinance(): Promise<PriceData | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const [btcRes, ethRes] = await Promise.all([
      fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT", { signal: controller.signal }),
      fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT", { signal: controller.signal }),
    ]);
    if (!btcRes.ok || !ethRes.ok) return null;
    const btcJson = await btcRes.json();
    const ethJson = await ethRes.json();

    const btc = parseFloat(btcJson.lastPrice);
    const eth = parseFloat(ethJson.lastPrice);
    const btcChange = parseFloat(btcJson.priceChangePercent).toFixed(2);
    const ethChange = parseFloat(ethJson.priceChangePercent).toFixed(2);

    return {
      btcPrice: "$" + btc.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ethPrice: "$" + eth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ethBtcPrice: (eth / btc).toFixed(6) + " BTC",
      btcChange24h: Number(btcChange) >= 0 ? `+${btcChange}%` : `${btcChange}%`,
      ethChange24h: Number(ethChange) >= 0 ? `+${ethChange}%` : `${ethChange}%`,
      source: "CoinGlass / Binance",
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchFromCoinGecko(): Promise<PriceData | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true",
      { signal: controller.signal }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const btc = parseFloat(data.bitcoin?.usd);
    const eth = parseFloat(data.ethereum?.usd);
    const btcChange = data.bitcoin?.usd_24h_change ? Number(data.bitcoin.usd_24h_change).toFixed(2) : undefined;
    const ethChange = data.ethereum?.usd_24h_change ? Number(data.ethereum.usd_24h_change).toFixed(2) : undefined;

    return {
      btcPrice: "$" + btc.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ethPrice: "$" + eth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ethBtcPrice: (eth / btc).toFixed(6) + " BTC",
      btcChange24h: btcChange ? (Number(btcChange) >= 0 ? `+${btcChange}%` : `${btcChange}%`) : undefined,
      ethChange24h: ethChange ? (Number(ethChange) >= 0 ? `+${ethChange}%` : `${ethChange}%`) : undefined,
      source: "CoinGlass / CoinGecko",
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function getAggregatedPrices(): Promise<PriceData> {
  const now = Date.now();
  if (cachedPriceData && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedPriceData;
  }

  // Try fetching in parallel or in order with failovers
  const result = (await fetchFromOKX()) || (await fetchFromBinance()) || (await fetchFromCoinGecko());

  if (result) {
    cachedPriceData = result;
    lastCacheTime = now;
    return result;
  }

  if (cachedPriceData) {
    return cachedPriceData;
  }

  return {
    btcPrice: "$81,500.00",
    ethPrice: "$2,650.00",
    ethBtcPrice: "0.032500 BTC",
    source: "CoinGlass",
    updatedAt: new Date().toISOString(),
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Cryptocurrency real-time prices proxy (Accessible in China without VPN)
  app.get("/api/prices", async (_req, res) => {
    try {
      const prices = await getAggregatedPrices();
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.json({ success: true, data: prices });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch prices";
      res.status(500).json({ success: false, error: errorMsg });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
