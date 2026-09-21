import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface EngineConfig {
  id: 'baidu' | 'google' | 'bing';
  name: string;
  btnText: string;
  placeholder: string;
  url: (q: string) => string;
  themeColor: string;
}

const ENGINES: EngineConfig[] = [
  {
    id: 'baidu',
    name: '百度',
    btnText: '百度一下',
    placeholder: '百度全网搜索...',
    url: (q) => `https://www.baidu.com/s?wd=${encodeURIComponent(q)}`,
    themeColor: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  {
    id: 'google',
    name: 'Google',
    btnText: 'Google',
    placeholder: 'Google 搜索...',
    url: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    themeColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  {
    id: 'bing',
    name: 'Bing',
    btnText: 'Bing',
    placeholder: 'Bing 必应搜索...',
    url: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
    themeColor: 'bg-teal-600 hover:bg-teal-700 text-white',
  },
];

export const WebSearchHero: React.FC = () => {
  const [selectedEngine, setSelectedEngine] = useState<'baidu' | 'google' | 'bing'>('baidu');
  const [query, setQuery] = useState('');

  const currentConfig = ENGINES.find((e) => e.id === selectedEngine) || ENGINES[0];

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetQuery = query.trim();
    if (!targetQuery) return;

    const url = currentConfig.url(targetQuery);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-lg mx-auto pt-1 pb-1">
      {/* Compact Engine Switcher Tabs */}
      <div className="flex items-center justify-center gap-1.5 mb-1.5">
        {ENGINES.map((engine) => {
          const isActive = selectedEngine === engine.id;
          return (
            <button
              key={engine.id}
              id={`engine-tab-${engine.id}`}
              type="button"
              onClick={() => setSelectedEngine(engine.id)}
              className={`px-2.5 py-0.5 text-xs rounded-md transition-all cursor-pointer ${
                isActive
                  ? 'bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {engine.name}
            </button>
          );
        })}
      </div>

      {/* Slim & Compact Search Form */}
      <form
        id="web-search-hero-form"
        onSubmit={handleSearch}
        className="flex items-center gap-1.5 p-1 rounded-xl border shadow-xs transition-all focus-within:ring-2 focus-within:ring-lime-500/40"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="pl-2.5 text-stone-400 shrink-0">
          <Search className="w-3.5 h-3.5" />
        </div>

        <input
          id="web-search-hero-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={currentConfig.placeholder}
          className="w-full bg-transparent px-1.5 py-1 text-xs md:text-sm focus:outline-none placeholder:text-stone-400"
        />

        {query && (
          <button
            type="button"
            id="clear-hero-search-btn"
            onClick={() => setQuery('')}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 px-1 text-xs font-bold shrink-0"
            title="清空"
          >
            ✕
          </button>
        )}

        <button
          id="hero-search-submit-btn"
          type="submit"
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${currentConfig.themeColor}`}
        >
          {currentConfig.btnText}
        </button>
      </form>
    </div>
  );
};
