import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, RefreshCw, Compass } from 'lucide-react';
import { CryptoPrices } from '../types';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  searchFilter: string;
  setSearchFilter: (v: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  searchFilter,
  setSearchFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState<'baidu' | 'google' | 'bing'>('baidu');
  const [prices, setPrices] = useState<CryptoPrices>({
    btcPrice: '-',
    ethPrice: '-',
    ethBtcPrice: '-',
    loading: true,
  });

  const fetchPrices = async () => {
    try {
      setPrices((prev) => ({ ...prev, loading: true }));
      const [btcRes, ethRes] = await Promise.all([
        fetch('https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT'),
        fetch('https://www.okx.com/api/v5/market/ticker?instId=ETH-USDT'),
      ]);

      if (!btcRes.ok || !ethRes.ok) throw new Error('Network response failed');

      const btcData = await btcRes.json();
      const ethData = await ethRes.json();

      let btcPriceStr = '-';
      let ethPriceStr = '-';
      let ethBtcStr = '-';

      if (btcData.data && btcData.data[0]) {
        const btc = parseFloat(btcData.data[0].last);
        btcPriceStr = '$' + btc.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      if (ethData.data && ethData.data[0]) {
        const eth = parseFloat(ethData.data[0].last);
        ethPriceStr = '$' + eth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (btcData.data && btcData.data[0]) {
          const btcVal = parseFloat(btcData.data[0].last);
          if (btcVal > 0) {
            ethBtcStr = (eth / btcVal).toFixed(6) + ' BTC';
          }
        }
      }

      setPrices({
        btcPrice: btcPriceStr,
        ethPrice: ethPriceStr,
        ethBtcPrice: ethBtcStr,
        lastUpdated: new Date(),
        loading: false,
      });
    } catch {
      setPrices((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleWebSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    const urls = {
      baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
      google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
    };

    window.open(urls[searchEngine], '_blank', 'noopener,noreferrer');
  };

  return (
    <header
      id="header-nav"
      className="sticky top-0 z-50 px-4 py-3 md:px-8 transition-colors backdrop-blur-xl border-b"
      style={{
        backgroundColor: 'var(--bg-sidebar)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="#"
          id="logo-brand"
          className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight text-emerald-800 dark:text-emerald-300"
        >
          <Compass className="w-7 h-7 text-lime-600 dark:text-lime-400 animate-spin-slow" />
          <span>南宫远区块链导航</span>
        </a>

        {/* Crypto Ticker Bar */}
        <div
          id="crypto-price-bar"
          className="flex items-center gap-2 md:gap-3 flex-wrap text-xs md:text-sm"
        >
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="font-bold text-amber-600 dark:text-amber-400">₿</span>
            <span className="font-semibold text-stone-600 dark:text-stone-300">BTC</span>
            <span className="font-medium">{prices.btcPrice}</span>
          </div>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="font-bold text-indigo-500 dark:text-indigo-400">Ξ</span>
            <span className="font-semibold text-stone-600 dark:text-stone-300">ETH</span>
            <span className="font-medium">{prices.ethPrice}</span>
          </div>

          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <span className="font-bold text-teal-600 dark:text-teal-400">⟠</span>
            <span className="font-semibold text-stone-600 dark:text-stone-300">ETH/BTC</span>
            <span className="font-medium">{prices.ethBtcPrice}</span>
          </div>

          <button
            id="refresh-price-btn"
            onClick={fetchPrices}
            title="刷新行情"
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-stone-500 dark:text-stone-400 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${prices.loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search Bar + Controls */}
        <div className="flex items-center gap-2 w-full lg:w-auto flex-1 lg:flex-initial justify-end">
          {/* External Web Search Form */}
          <form
            id="search-web-form"
            onSubmit={handleWebSearch}
            className="flex items-center rounded-full border px-2 py-1 shadow-sm flex-1 max-w-md"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <Search className="w-4 h-4 ml-1 text-stone-400 shrink-0" />
            <input
              id="search-web-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索网络或输入关键字..."
              className="w-full bg-transparent px-2 text-xs md:text-sm focus:outline-none placeholder:text-stone-400"
            />
            <select
              id="search-engine-select"
              value={searchEngine}
              onChange={(e) => setSearchEngine(e.target.value as 'baidu' | 'google' | 'bing')}
              className="bg-transparent text-xs font-medium text-stone-600 dark:text-stone-300 cursor-pointer border-l pl-2 pr-1 py-0.5 outline-none"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <option value="baidu" className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100">百度</option>
              <option value="google" className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100">Google</option>
              <option value="bing" className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100">Bing</option>
            </select>
            <button
              id="search-submit-button"
              type="submit"
              className="ml-1 px-3 py-1 text-xs rounded-full bg-lime-700 hover:bg-lime-800 dark:bg-lime-600 dark:hover:bg-lime-500 text-white font-medium transition cursor-pointer"
            >
              搜索
            </button>
          </form>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-button"
            onClick={toggleTheme}
            aria-label="切换明暗主题"
            className="w-9 h-9 flex items-center justify-center rounded-lg border shadow-sm transition hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-emerald-800" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
