import React, { useEffect, useRef } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { Calendar } from './Calendar';

interface CalendarImageProps {
  format: 'png' | 'jpg';
}

export const CalendarImage: React.FC<CalendarImageProps> = ({ format }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const generateImage = async () => {
        try {
          const dataUrl = format === 'png' 
            ? await toPng(containerRef.current!, { quality: 1.0, pixelRatio: 2 })
            : await toJpeg(containerRef.current!, { quality: 0.95, pixelRatio: 2 });
          
          // Create download link
          const link = document.createElement('a');
          link.download = `calendar-2025.${format}`;
          link.href = dataUrl;
          link.click();
        } catch (error) {
          console.error('Error generating image:', error);
        }
      };

      generateImage();
    }
  }, [format]);

  return (
    <div ref={containerRef}>
      <Calendar />
    </div>
  );
};
