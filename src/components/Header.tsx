import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, RefreshCw, Compass, CheckCircle2 } from 'lucide-react';
import { CryptoPrices } from '../types';
import { fetchLiveCryptoPrices, loadCachedPrices } from '../utils/cryptoPrice';

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
  const [prices, setPrices] = useState<CryptoPrices>(() => loadCachedPrices());
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  const fetchPrices = async () => {
    setPrices((prev) => ({ ...prev, loading: true }));
    try {
      const live = await fetchLiveCryptoPrices();
      setPrices(live);
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 2000);
    } catch {
      setPrices((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    // Immediate background fetch on mount
    fetchPrices();
    // Auto refresh every 20 seconds
    const interval = setInterval(fetchPrices, 20000);
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
            {prices.btcChange24h && (
              <span
                className={`text-[11px] font-medium px-1 rounded ${
                  prices.btcChange24h.startsWith('+')
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                    : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                }`}
              >
                {prices.btcChange24h}
              </span>
            )}
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
            {prices.ethChange24h && (
              <span
                className={`text-[11px] font-medium px-1 rounded ${
                  prices.ethChange24h.startsWith('+')
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                    : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                }`}
              >
                {prices.ethChange24h}
              </span>
            )}
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

          <a
            href="https://www.coinglass.com/zh"
            target="_blank"
            rel="noopener noreferrer"
            title="点击前往 CoinGlass 查看深度衍生品与爆仓数据 (国内已通过服务代理直连，无需翻墙)"
            className="hidden xl:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-lime-600/30 dark:border-lime-400/30 text-lime-800 dark:text-lime-300 hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>CoinGlass数据</span>
          </a>

          <div className="relative flex items-center">
            <button
              id="refresh-price-btn"
              onClick={fetchPrices}
              title={`点击刷新行情 (数据源: ${prices.source || '聚合行情'}, 上次更新: ${prices.lastUpdated ? new Date(prices.lastUpdated).toLocaleTimeString() : '刚刚'})`}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-stone-500 dark:text-stone-400 transition cursor-pointer flex items-center gap-1"
            >
              {refreshSuccess ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <RefreshCw className={`w-3.5 h-3.5 ${prices.loading ? 'animate-spin text-lime-600 dark:text-lime-400' : ''}`} />
              )}
            </button>
            {refreshSuccess && (
              <span className="absolute -bottom-6 right-0 text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded shadow whitespace-nowrap z-50 pointer-events-none">
                已更新
              </span>
            )}
          </div>
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
