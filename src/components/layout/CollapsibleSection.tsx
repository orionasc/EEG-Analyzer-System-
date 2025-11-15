import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NeuralDivider } from '../common/NeuralDivider';

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
      className={`cl-slab cl-veil relative overflow-hidden text-[0.92rem] ${className ?? ''}`.trim()}
    >
      <div className="cl-slab-edge" />
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between gap-3 px-[var(--cl-h-gutter)] py-4 text-left text-[rgba(249,245,236,0.92)]"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold tracking-[0.08em] uppercase text-[rgba(236,229,220,0.76)]">{title}</span>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(198,188,255,0.2)] bg-[rgba(24,19,34,0.8)] text-xs text-[rgba(249,245,236,0.85)] transition-transform duration-300 ${arrowRotation}`}
        >
          ➜
        </span>
      </button>
      <NeuralDivider curvature={0.3} opacity={0.35} />
      <div
        ref={contentRef}
        className={`overflow-hidden transition-[max-height] duration-[400ms] ease-in-out ${contentClassName ?? ''}`.trim()}
        style={{ maxHeight }}
      >
        <div className="px-[var(--cl-h-gutter)] pb-5 text-[rgba(236,229,220,0.78)]">{children}</div>
      </div>
    </section>
  );
};
