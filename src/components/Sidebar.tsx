import React from 'react';
import { CategoryData } from '../types';

interface SidebarProps {
  categories: CategoryData[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <aside id="sidebar-navigation" className="hidden lg:block w-56 shrink-0">
      <div
        className="sticky top-24 rounded-2xl p-4 shadow-sm border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <h2 className="text-xs font-bold uppercase tracking-wider mb-3 px-2 text-stone-500 dark:text-stone-400">
          网站分类
        </h2>
        <nav className="flex flex-col space-y-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`sidebar-link-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-xl transition text-left cursor-pointer ${
                  isActive
                    ? 'font-bold shadow-sm'
                    : 'hover:translate-x-1'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                  color: 'var(--text-primary)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                <span className="text-xs px-1.5 py-0.5 rounded-full opacity-70 bg-black/5 dark:bg-white/10">
                  {cat.items.length}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
