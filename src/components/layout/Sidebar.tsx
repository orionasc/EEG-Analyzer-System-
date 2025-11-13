import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className }) => {
  return (
    <aside className={`grid shrink-0 auto-rows-min gap-4 ${className ?? ''}`.trim()}>
      {children}
    </aside>
  );
};
