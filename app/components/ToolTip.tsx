import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface TooltipInterface {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
  wParam?: string;
}

const TT: React.FC<TooltipInterface> = ({ children, wParam, text, position = 'top' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rect, setRect] = useState<any>();
  const [tooltipStyle, setTooltipStyle] = useState({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovered && wrapperRef.current && tooltipRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      setRect(rect);

      const tooltipWidth = tooltipRect.width;
      const tooltipHeight = tooltipRect.height;

      const tooltipPosition = {
        top:
          position === 'top'
            ? rect.top - tooltipHeight - 10
            : position === 'bottom'
            ? rect.bottom
            : rect.top + rect.height / 2,
        left:
          position === 'left'
            ? rect.left - tooltipWidth - 10
            : position === 'right'
            ? rect.right + 10
            : rect.left + (rect.width / 2) - 5,
        transform: position === 'top' || position === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)',
      };

      setTooltipStyle(tooltipPosition);
    }
  }, [isHovered, position]);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 650);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`inline-flex ${wParam || ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isHovered && (
        <div
          ref={tooltipRef}
          className="fixed px-2 py-2 text-center text-xs font-semibold text-white bg-stone-950 rounded-xl shadow-lg z-50 font-work"
          style={tooltipStyle}
        >
          {text}
          <div
            className={`absolute w-0 h-0 border-transparent ${
              position === 'top'
                ? 'border-t-stone-950 border-l-8 border-r-8 border-t-8'
                : position === 'bottom'
                ? 'border-b-stone-950 border-l-8 border-r-8 border-b-8'
                : position === 'left'
                ? 'border-l-stone-950 border-t-8 border-b-8 border-l-8'
                : 'border-r-stone-950 border-t-8 border-b-8 border-r-8'
            }`}
            style={{
              top:
                position === 'top'
                  ? '100%'
                  : position === 'bottom'
                  ? '-8px'
                  : '50%',
              left:
                position === 'left'
                  ? '100%'
                  : position === 'right'
                  ? '-8px'
                  : '50%',
              transform:
                position === 'top' || position === 'bottom'
                  ? 'translateX(-50%)'
                  : 'translateY(-50%)',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TT;
