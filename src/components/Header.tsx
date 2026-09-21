import React, { useState, useEffect } from 'react';
import { Moon, Sun, RefreshCw, Compass, CheckCircle2 } from 'lucide-react';
import { CryptoPrices } from '../types';
import { fetchLiveCryptoPrices, loadCachedPrices } from '../utils/cryptoPrice';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
}) => {
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

  return (
    <header
      id="header-nav"
      className="sticky top-0 z-40 px-4 py-2.5 md:px-8 transition-colors backdrop-blur-xl border-b"
      style={{
        backgroundColor: 'var(--bg-sidebar)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo */}
        <a
          href="#"
          id="logo-brand"
          className="flex items-center gap-2 text-lg md:text-xl font-bold tracking-tight text-emerald-800 dark:text-emerald-300 shrink-0"
        >
          <Compass className="w-6 h-6 md:w-7 md:h-7 text-lime-600 dark:text-lime-400 animate-spin-slow" />
          <span>南宫远区块链导航</span>
        </a>

        {/* Crypto Ticker Bar */}
        <div
          id="crypto-price-bar"
          className="hidden md:flex items-center gap-2 lg:gap-3 text-xs md:text-sm"
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
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md border"
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
            className="hidden lg:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-lime-600/30 dark:border-lime-400/30 text-lime-800 dark:text-lime-300 hover:bg-black/5 dark:hover:bg-white/10 transition"
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

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile Refresh Button */}
          <button
            id="mobile-refresh-price-btn"
            onClick={fetchPrices}
            title="刷新行情"
            className="md:hidden p-1.5 rounded-lg border text-stone-500 transition"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <RefreshCw className={`w-4 h-4 ${prices.loading ? 'animate-spin text-lime-600' : ''}`} />
          </button>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-button"
            onClick={toggleTheme}
            aria-label="切换明暗主题"
            className="w-9 h-9 flex items-center justify-center rounded-lg border shadow-sm transition hover:scale-105 cursor-pointer"
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
