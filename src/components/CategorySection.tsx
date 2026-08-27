import React from 'react';
import { ExternalLink } from 'lucide-react';
import { CategoryData } from '../types';

interface CategorySectionProps {
  category: CategoryData;
  filterQuery: string;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  filterQuery,
}) => {
  const filteredItems = category.items.filter((item) => {
    if (!filterQuery) return true;
    const query = filterQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.url.toLowerCase().includes(query)
    );
  });

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <section
      id={`section-${category.id}`}
      className="rounded-2xl p-5 md:p-6 shadow-sm border transition-all scroll-mt-24"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Category Header */}
      <div
        className="flex items-center justify-between pb-3 mb-4 border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{category.icon}</span>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-emerald-900 dark:text-emerald-200">
            {category.name}
          </h2>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-black/5 dark:bg-white/10 opacity-80">
          {filteredItems.length} 个站点
        </span>
      </div>

      {/* Grid of Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredItems.map((item, index) => (
          <a
            key={`${item.title}-${index}`}
            id={`nav-item-${category.id}-${index}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between p-3.5 rounded-xl border transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'transparent',
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-sm group-hover:text-lime-700 dark:group-hover:text-lime-400 transition-colors">
                {item.title}
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
            </div>

            <p className="text-xs mt-2 line-clamp-2 leading-relaxed opacity-85">
              {item.desc}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
};
