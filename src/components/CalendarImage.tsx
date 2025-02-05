import React, { useEffect, useRef, useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { Calendar } from './Calendar';

const isBrowser = typeof window !== 'undefined';

interface CalendarImageProps {
  format: 'png' | 'jpg';
  size?: string;
  orientation?: 'portrait' | 'landscape';
  rows?: number;
  columns?: number;
  dpi?: number;
  header?: boolean;
  testing?: boolean;
  year?: number;
  filename?: string;
}

// Standard print DPI
const TARGET_DPI = 192; // 600 dpi eventually, 192 while testing
// Standard screen DPI
const SCREEN_DPI = 96;

// Print dimensions (in inches)
const PAPER_SIZES = {
  letter: { width: 8.5, height: 11 },
  legal: { width: 8.5, height: 14 },
  tabloid: { width: 11, height: 17 },
  a6: { width: 4.125, height: 5.875},
  a5: { width: 5.8, height: 8.27 },
  a4: { width: 8.27, height: 11.69 }
};

// Default layout for each size/orientation
const PAGE_LAYOUTS = {
  letter: {
    portrait: { rows: 4, columns: 3 },
    landscape: { rows: 3, columns: 4 }
  },
  legal: {
    portrait: { rows: 5, columns: 3 },
    landscape: { rows: 3, columns: 5 }
  },
  tabloid: {
    portrait: { rows: 5, columns: 3 },
    landscape: { rows: 3, columns: 5 }
  },
  a6: {
    portrait: { rows: 4, columns: 3 },
    landscape: { rows: 3, columns: 4 }
  },
  a5: {
    portrait: { rows: 4, columns: 3 },
    landscape: { rows: 3, columns: 4 }
  },
  a4: {
    portrait: { rows: 4, columns: 3 },
    landscape: { rows: 3, columns: 4 }
  }
};

export const CalendarImage: React.FC<CalendarImageProps> = ({
  format,
  size = 'letter',
  orientation = 'portrait',
  rows,
  columns,
  dpi = 300,
  header = true,
  testing = false,
  year = new Date().getFullYear(),
  filename
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasGeneratedRef = useRef(false);
  const [error, setError] = React.useState<string | null>(null);

  // Get default layout for this size/orientation
  const defaultLayout = PAGE_LAYOUTS[size?.toLowerCase()]?.[orientation] ?? PAGE_LAYOUTS.letter.portrait;
  
  // Use provided values or defaults
  const actualRows = rows ?? defaultLayout.rows;
  const actualColumns = columns ?? defaultLayout.columns;

  useEffect(() => {
    if (!isBrowser) return;
    
    const generateImage = async () => {
      if (!containerRef.current || hasGeneratedRef.current || testing) return;
      
      try {
        hasGeneratedRef.current = true;

        const options = {
          quality: format === 'png' ? 1.0 : 0.95,
          pixelRatio: dpi / SCREEN_DPI,
          backgroundColor: '#FFFFFF',
          style: {
            background: '#FFFFFF'
          }
        };

        const dataUrl = format === 'png'
          ? await toPng(containerRef.current, options)
          : await toJpeg(containerRef.current, options);
        
        const link = document.createElement('a');
        link.download = `${filename || `calendar-${year}-${dpi}dpi-${size}-${orientation}`}.${format}`;
        link.href = dataUrl;
        link.click();

      } catch (error) {
        console.error('Error generating image:', error);
        setError('Failed to generate image');
      }
    };

    // Small delay to ensure component is fully rendered
    const timeoutId = setTimeout(generateImage, 500);
    return () => clearTimeout(timeoutId);
  }, [format, size, orientation, actualColumns, actualRows, dpi, testing, filename]);

  return (
    <>
      {testing && (
        <div className="debug" style={{
          position: 'fixed',
          top: 10,
          right: 10,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 1000
        }}>
          <div>Size: {size}</div>
          <div>Orientation: {orientation}</div>
          <div>Columns: {actualColumns}</div>
          <div>Rows: {actualRows}</div>
          <div>DPI: {dpi}</div>
          <div>Format: {format}</div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className={`calendar-print-container size-${size} orientation-${orientation}`}
      >
        <Calendar 
          forPrint={true}
          printColumns={actualColumns}
          rows={actualRows}
          year={year}
          header={header}
          size={size}
          orientation={orientation}
          testing={testing}
        />
      </div>
    </>
  );
};
