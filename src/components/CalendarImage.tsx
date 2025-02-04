import React, { useEffect, useRef } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { Calendar } from './Calendar';

interface CalendarImageProps {
  format: 'png' | 'jpg';
}

// Standard print DPI
const TARGET_DPI = 600;
// Standard screen DPI (96 is common for most displays)
const SCREEN_DPI = 96;

// Print dimensions (in inches)
const PAPER_SIZES = {
  letter: { width: 8.5, height: 11 }
};

// Print layout configurations
const PRINT_LAYOUTS = {
  letter: {
    portrait: { columns: 3, rows: 5 },  // 3x5 grid (15 months)
    landscape: { columns: 4, rows: 4 }  // 4x4 grid (16 months)
  }
};

export const CalendarImage: React.FC<CalendarImageProps> = ({ format }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasGeneratedRef = useRef(false);

  // Use letter size portrait as default
  const paperSize = PAPER_SIZES.letter;
  const layout = PRINT_LAYOUTS.letter.portrait;

  useEffect(() => {
    const generateImage = async () => {
      if (!containerRef.current || hasGeneratedRef.current) return;
      
      try {
        hasGeneratedRef.current = true;

        // Calculate the target dimensions in pixels for 600 DPI
        const targetWidthPx = Math.round(paperSize.width * TARGET_DPI);
        const targetHeightPx = Math.round(paperSize.height * TARGET_DPI);
        
        // Get current element dimensions
        const currentWidth = containerRef.current.offsetWidth;
        const currentHeight = containerRef.current.offsetHeight;
        
        // Calculate required pixel ratio to achieve target dimensions
        const pixelRatio = Math.max(
          targetWidthPx / currentWidth,
          targetHeightPx / currentHeight
        );

        console.log(`Generating ${format.toUpperCase()} with:
          Target DPI: ${TARGET_DPI}
          Paper Size: ${paperSize.width}"x${paperSize.height}"
          Layout: ${layout.columns}x${layout.rows}
          Current Size: ${currentWidth}x${currentHeight}px
          Target Size: ${targetWidthPx}x${targetHeightPx}px
          Pixel Ratio: ${pixelRatio}
        `);

        const options = {
          quality: format === 'png' ? 1.0 : 0.95,
          pixelRatio,
          backgroundColor: '#FFFFFF',
          style: {
            background: '#FFFFFF'
          },
          width: currentWidth,
          height: currentHeight
        };

        const dataUrl = format === 'png'
          ? await toPng(containerRef.current, options)
          : await toJpeg(containerRef.current, options);
        
        const link = document.createElement('a');
        link.download = `calendar-2025-${TARGET_DPI}dpi-${layout.columns}x${layout.rows}.${format}`;
        link.href = dataUrl;
        link.click();

        // Log the final image dimensions
        const img = new Image();
        img.onload = () => {
          console.log(`Final image dimensions: ${img.width}x${img.height}px`);
          console.log(`Effective DPI: ${Math.round(img.width / paperSize.width)}`);
        };
        img.src = dataUrl;

      } catch (error) {
        console.error('Error generating image:', error);
      }
    };

    // Small delay to ensure component is fully rendered
    const timeoutId = setTimeout(generateImage, 100);
    return () => clearTimeout(timeoutId);
  }, [format]);

  // Calculate base size to match paper aspect ratio
  const baseStyle: React.CSSProperties = {
    width: '816px', // 8.5 inches at 96 DPI
    height: `${Math.round(816 * (paperSize.height / paperSize.width))}px`, // Maintain aspect ratio
    margin: '0 auto',
    boxSizing: 'border-box'
  };

  return (
    <div ref={containerRef} className="calendar-print-container" style={baseStyle}>
      <Calendar forPrint={true} printColumns={layout.columns} />
    </div>
  );
};
