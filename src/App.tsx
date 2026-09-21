import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WebSearchHero } from './components/WebSearchHero';
import { Sidebar } from './components/Sidebar';
import { CategorySection } from './components/CategorySection';
import { ScrollTop } from './components/ScrollTop';
import { CATEGORIES_DATA } from './data/navData';
import { Search, Compass, Sparkles, Filter } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeCategory, setActiveCategory] = useState<string>('common');
  const [filterQuery, setFilterQuery] = useState<string>('');

  useEffect(() => {
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.body.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('app-theme', nextTheme);
    document.body.setAttribute('data-theme', nextTheme === 'dark' ? 'dark' : '');
  };

  const handleSelectCategory = (id: string) => {
    setActiveCategory(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Calculate total and filtered sites
  const totalSites = CATEGORIES_DATA.reduce((acc, cat) => acc + cat.items.length, 0);
  const matchingSites = CATEGORIES_DATA.reduce((acc, cat) => {
    return (
      acc +
      cat.items.filter((item) => {
        if (!filterQuery) return true;
        const q = filterQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          item.url.toLowerCase().includes(q)
        );
      }).length
    );
  }, 0);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-lime-500 selection:text-white">
      <div className="bg-animation" />

      {/* Header with live crypto prices & theme toggle */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-3 md:py-4 flex-1">
        {/* 1. Upper Search Hero: Baidu / Google / Bing Web Search (Compact) */}
        <WebSearchHero />

        {/* 2. Lower Directory & Site Navigation Section (Separated from Web Search) */}
        <div className="mt-3 md:mt-4 mb-5">
          {/* Section Toolbar: Header + Site Search Box */}
          <div
            className="rounded-2xl p-4 md:p-5 border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Title & Count */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-500/15 text-lime-700 dark:text-lime-400 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-bold text-stone-900 dark:text-stone-100">
                    本站收录导航
                  </h2>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-lime-500/15 text-lime-800 dark:text-lime-300">
                    {filterQuery ? `匹配 ${matchingSites} / ${totalSites} 站` : `收录 ${totalSites} 个站点`}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  精选交易所、行情图表、链上分析工具与实用资源
                </p>
              </div>
            </div>

            {/* 本站搜索框 (放于下方内容区，带有明确的站内检索标识) */}
            <div className="w-full md:w-auto flex-1 max-w-md flex items-center gap-2">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl border w-full shadow-sm transition-all focus-within:ring-2 focus-within:ring-lime-500/40"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <Filter className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0" />
                <input
                  id="filter-sites-input"
                  type="text"
                  placeholder="在全站 100+ 网址中快速检索 (如: 欧易, 币安, 钱包)..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full bg-transparent text-xs md:text-sm focus:outline-none placeholder:text-stone-400"
                />
                {filterQuery && (
                  <button
                    id="clear-filter-btn"
                    onClick={() => setFilterQuery('')}
                    className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 font-bold px-1 py-0.5 rounded cursor-pointer"
                    title="清空站内搜索"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Category Horizontal Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 lg:hidden max-w-full">
            {CATEGORIES_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap border transition cursor-pointer ${
                  activeCategory === cat.id ? 'font-bold' : ''
                }`}
                style={{
                  backgroundColor:
                    activeCategory === cat.id ? 'var(--bg-secondary)' : 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content with Sidebar */}
        <div className="flex gap-6 lg:gap-8 items-start">
          <Sidebar
            categories={CATEGORIES_DATA}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />

          <main id="main-sections-container" className="flex-1 space-y-6 min-w-0">
            {matchingSites === 0 ? (
              <div
                className="rounded-2xl p-8 text-center border"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <Search className="w-8 h-8 mx-auto text-stone-400 mb-2 opacity-50" />
                <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                  本站未找到匹配 “{filterQuery}” 的收录站点
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  您可以清空关键词重新查找，或使用页面上方的「百度搜索」检索全网
                </p>
                <button
                  onClick={() => setFilterQuery('')}
                  className="mt-4 px-4 py-1.5 rounded-lg text-xs bg-lime-600 text-white font-medium hover:bg-lime-700 transition cursor-pointer"
                >
                  清空筛选条件
                </button>
              </div>
            ) : (
              CATEGORIES_DATA.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  filterQuery={filterQuery}
                />
              ))
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer
        id="app-footer"
        className="py-8 px-4 text-center border-t text-xs md:text-sm transition-colors mt-auto"
        style={{
          backgroundColor: 'var(--bg-sidebar)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-1">
          <p className="font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
            <span>© {new Date().getFullYear()} 南宫远区块链导航 · 用心打造</span>
          </p>
          <p className="text-xs opacity-75">
            实时加密货币行情 · 综合分类索引 · 便捷搜索工具
          </p>
        </div>
      </footer>

      {/* Floating Scroll Top */}
      <ScrollTop />
    </div>
  );
}
