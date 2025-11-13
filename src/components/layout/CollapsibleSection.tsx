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
      className={`rounded-xl border border-white/8 bg-slate-900/60 text-slate-200 shadow-sm backdrop-blur transition-colors ${
        className ?? ''
      }`.trim()}
    >
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-[10px] transition-transform duration-200 ${
            arrowRotation
          }`}
        >
          ➤
        </span>
      </button>
      <div
        ref={contentRef}
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${contentClassName ?? ''}`.trim()}
        style={{ maxHeight }}
      >
        <div className="px-3 pb-3">{children}</div>
      </div>
    </section>
  );
};
