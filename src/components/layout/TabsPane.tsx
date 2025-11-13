import React from 'react';

type Tab = {
  id: string;
  label: string;
};

interface TabsPaneProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
}

export const TabsPane: React.FC<TabsPaneProps> = ({ tabs, activeTab, onTabChange, children }) => {
  return (
    <div className="flex h-full flex-col gap-3">
      <nav className="flex items-center gap-1 border-b border-white/10 pb-2 text-[11px]" aria-label="Data views">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              className={`rounded-full px-3 py-1.5 uppercase tracking-[0.18em] transition ${
                isActive
                  ? 'bg-blue-500/80 text-slate-950 shadow-sm'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-900/80'
              }`}
              onClick={() => onTabChange(tab.id)}
              aria-pressed={isActive}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
      <section className="relative flex-1 overflow-hidden">{children}</section>
    </div>
  );
};
