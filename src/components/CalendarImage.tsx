import React, { useEffect, useRef } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { Calendar } from './Calendar';

interface CalendarImageProps {
  format: 'png' | 'jpg';
}

export const CalendarImage: React.FC<CalendarImageProps> = ({ format }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    const generateImage = async () => {
      if (!containerRef.current || hasGeneratedRef.current) return;
      
      try {
        hasGeneratedRef.current = true;
        const options = {
          quality: format === 'png' ? 1.0 : 0.95,
          pixelRatio: 2,
          backgroundColor: '#FFFFFF',
          style: {
            background: '#FFFFFF'
          }
        };

        const dataUrl = format === 'png'
          ? await toPng(containerRef.current, options)
          : await toJpeg(containerRef.current, options);
        
        const link = document.createElement('a');
        link.download = `calendar-2025.${format}`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    };

    // Small delay to ensure component is fully rendered
    const timeoutId = setTimeout(generateImage, 100);
    return () => clearTimeout(timeoutId);
  }, [format]);

  return (
    <div ref={containerRef} style={{ background: '#FFFFFF', padding: '20px' }}>
      <Calendar />
    </div>
  );
};
