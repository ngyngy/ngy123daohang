import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      id="scroll-to-top-button"
      onClick={scrollToTop}
      aria-label="返回顶部"
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
      style={{
        background: 'var(--primary-gradient)',
      }}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
