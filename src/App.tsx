import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CategorySection } from './components/CategorySection';
import { ScrollTop } from './components/ScrollTop';
import { CATEGORIES_DATA } from './data/navData';
import { Search } from 'lucide-react';

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

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-lime-500 selection:text-white">
      <div className="bg-animation" />

      {/* Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        searchFilter={filterQuery}
        setSearchFilter={setFilterQuery}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 md:py-8 flex-1">
        {/* Quick Filter Bar */}
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border max-w-sm w-full shadow-sm"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              id="filter-sites-input"
              type="text"
              placeholder="快速过滤页面内网址 / 工具 / 交易所..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-transparent text-xs md:text-sm focus:outline-none placeholder:text-stone-400"
            />
            {filterQuery && (
              <button
                id="clear-filter-btn"
                onClick={() => setFilterQuery('')}
                className="text-xs opacity-60 hover:opacity-100 font-bold px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:hidden max-w-full">
            {CATEGORIES_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap border transition ${
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
            {CATEGORIES_DATA.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                filterQuery={filterQuery}
              />
            ))}
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
        <p className="font-medium">© {new Date().getFullYear()} 南宫远区块链导航 · 用心打造</p>
        <p className="text-xs opacity-75 mt-1">
          实时加密货币行情 · 综合分类索引 · 便捷搜索工具
        </p>
      </footer>

      {/* Floating Scroll Top */}
      <ScrollTop />
    </div>
  );
}
