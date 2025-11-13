import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className }) => {
  return (
    <aside className={`flex shrink-0 flex-col gap-3 ${className ?? ''}`.trim()}>
      {children}
    </aside>
  );
};
