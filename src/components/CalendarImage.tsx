import React, { useEffect, useRef, useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { Calendar } from './Calendar';
import { TARGET_DPI, SCREEN_DPI, getPageLayout } from '../config/pageConfig';

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

  // Get layout from shared configuration
  const defaultLayout = getPageLayout(size, orientation);
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

        // Generate image based on format
        const imageData = format === 'png' 
          ? await toPng(containerRef.current, options)
          : await toJpeg(containerRef.current, options);

        // Create download link
        const link = document.createElement('a');
        link.download = filename || `calendar-${year}-${size}-${orientation}.${format}`;
        link.href = imageData;
        link.click();
      } catch (err) {
        setError(err.message);
        console.error('Error generating image:', err);
      }
    };

    generateImage();
  }, [containerRef, format, dpi, size, orientation, year, filename, testing]);

  return (
    <Calendar
      ref={containerRef}
      year={year}
      forPrint={true}
      size={size}
      orientation={orientation}
      rows={actualRows}
      header={header}
      testing={testing}
    />
  );
};
