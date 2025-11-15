import React from 'react';
import { NeuralDivider } from '../common/NeuralDivider';

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
    <div className="flex h-full flex-col gap-4">
      <nav className="relative flex items-center gap-3 overflow-x-auto pb-2 text-sm text-[rgba(214,205,196,0.7)]">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              className={`relative pb-2 text-sm font-medium uppercase tracking-[0.22em] transition-colors ${
                isActive
                  ? 'text-[rgba(249,245,236,0.95)]'
                  : 'text-[rgba(214,205,196,0.5)] hover:text-[rgba(249,245,236,0.78)]'
              }`}
              onClick={() => onTabChange(tab.id)}
              aria-pressed={isActive}
            >
              {isActive && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-[rgba(105,217,255,0.7)] via-[rgba(143,111,255,0.6)] to-[rgba(255,182,72,0.65)] shadow-[0_0_16px_rgba(105,217,255,0.45)]" aria-hidden />
              )}
              {tab.label}
            </button>
          );
        })}
      </nav>
      <NeuralDivider curvature={0.45} opacity={0.4} />
      <section className="relative flex-1 overflow-hidden rounded-2xl border border-[rgba(198,188,255,0.14)] bg-[rgba(15,12,24,0.65)] p-1">
        {children}
      </section>
    </div>
  );
};
