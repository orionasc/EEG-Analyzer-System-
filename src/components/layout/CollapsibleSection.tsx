import React, { useEffect, useMemo, useRef, useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  defaultOpen = true,
  children,
  className,
  contentClassName
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [maxHeight, setMaxHeight] = useState<string | number>(defaultOpen ? 'none' : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const updateHeight = () => {
      const contentHeight = element.scrollHeight;
      setMaxHeight(isOpen ? contentHeight : 0);
    };

    updateHeight();

    if (typeof ResizeObserver === 'undefined') {
      return () => undefined;
    }

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setMaxHeight(0);
      return;
    }

    const element = contentRef.current;
    if (element) {
      setMaxHeight(element.scrollHeight);
    }
  }, [isOpen, children]);

  const arrowRotation = useMemo(() => (isOpen ? 'rotate-90' : 'rotate-0'), [isOpen]);

  return (
    <section
      className={`rounded-2xl border border-white/10 bg-white/5 text-slate-200 shadow-[0_1px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-colors ${
        className ?? ''
      }`.trim()}
    >
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-slate-100"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs text-slate-200 transition-transform duration-200 ${
            arrowRotation
          }`}
        >
          ➜
        </span>
      </button>
      <div
        ref={contentRef}
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${contentClassName ?? ''}`.trim()}
        style={{ maxHeight }}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </section>
  );
};
