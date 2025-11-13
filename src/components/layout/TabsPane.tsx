import React, { useEffect, useState } from 'react';

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
  const [currentTab, setCurrentTab] = useState(activeTab);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const handleTabClick = (id: string) => {
    setCurrentTab(id);
    onTabChange(id);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <nav
        className="flex items-center gap-4 overflow-x-auto border-b border-white/10 pb-2 text-sm text-slate-300 whitespace-nowrap"
        aria-label="Data views"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === currentTab;
          return (
            <button
              key={tab.id}
              type="button"
              className={`pb-2 text-sm transition ${
                isActive
                  ? 'border-b-2 border-blue-400 text-blue-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => handleTabClick(tab.id)}
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
