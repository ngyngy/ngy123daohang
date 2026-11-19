import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WebSearchHero } from './components/WebSearchHero';
import { Sidebar } from './components/Sidebar';
import { CategorySection } from './components/CategorySection';
import { ScrollTop } from './components/ScrollTop';
import { CATEGORIES_DATA } from './data/navData';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeCategory, setActiveCategory] = useState<string>('common');

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

      {/* Header with live crypto prices & theme toggle */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-3 md:py-4 flex-1">
        {/* 1. Upper Search Hero: Baidu / Google / Bing Web Search (Compact) */}
        <WebSearchHero />

        {/* Mobile Category Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-3 lg:hidden max-w-full">
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

        {/* Content with Sidebar */}
        <div className="flex gap-6 lg:gap-8 items-start mt-2 lg:mt-5">
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
