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
    <div className="tabs-pane">
      <nav className="tabs-pane__tablist" aria-label="Data views">
        <ul>
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                className={tab.id === activeTab ? 'tab tab--active' : 'tab'}
                onClick={() => onTabChange(tab.id)}
                aria-pressed={tab.id === activeTab}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <section className="tabs-pane__content">{children}</section>
    </div>
  );
};
