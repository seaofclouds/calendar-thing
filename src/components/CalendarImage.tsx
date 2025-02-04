import React, { useEffect, useRef } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { Calendar } from './Calendar';
import { useSearchParams } from 'react-router-dom';

interface CalendarImageProps {
  format: 'png' | 'jpg';
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
  a4: { width: 8.27, height: 11.69 },
} as const;

type PaperSize = keyof typeof PAPER_SIZES;

// Print layout configurations
const PRINT_LAYOUTS = {
  letter: {
    portrait: { columns: 3, rows: 5 },  // 3x5 grid (15 months)
    landscape: { columns: 4, rows: 4 }  // 4x4 grid (16 months)
  },
  legal: {
    portrait: { columns: 3, rows: 5 },  // 3x5 grid (15 months)
    landscape: { columns: 4, rows: 4 }  // 4x4 grid (16 months)
  },
  tabloid: {
    portrait: { columns: 3, rows: 5 },  // 3x5 grid (15 months)
    landscape: { columns: 4, rows: 4 }  // 4x4 grid (16 months)
  },
  a6: {
    portrait: { columns: 3, rows: 5 },  // 3x5 grid (15 months)
    landscape: { columns: 4, rows: 4 }  // 4x4 grid (16 months)
  },
  a5: {
    portrait: { columns: 3, rows: 5 },  // 3x5 grid (15 months)
    landscape: { columns: 4, rows: 4 }  // 4x4 grid (16 months)
  },
  a4: {
    portrait: { columns: 3, rows: 5 },  // 3x5 grid (15 months)
    landscape: { columns: 4, rows: 4 }  // 4x4 grid (16 months)
  }
} as const;

export const CalendarImage: React.FC<CalendarImageProps> = ({ format }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasGeneratedRef = useRef(false);
  const [searchParams] = useSearchParams();

  // Parse URL parameters with defaults
  const size = (searchParams.get('size') as PaperSize) || 'letter';
  const orientation = searchParams.get('orientation') || 'portrait';
  const columns = parseInt(searchParams.get('columns') || '0') || 
    (orientation === 'landscape' ? 4 : 3);
  const dpi = parseInt(searchParams.get('dpi') || '600');
  const testing = searchParams.get('testing') === 'on';
  
  // Validate and get paper size
  const paperSize = PAPER_SIZES[size] || PAPER_SIZES.letter;
  
  // Adjust dimensions for orientation
  const dimensions = orientation === 'landscape' 
    ? { width: paperSize.height, height: paperSize.width }
    : paperSize;

  useEffect(() => {
    const generateImage = async () => {
      if (!containerRef.current || hasGeneratedRef.current || testing) return;
      
      try {
        hasGeneratedRef.current = true;

        // Calculate the target dimensions in pixels for target DPI
        const targetWidthPx = Math.round(dimensions.width * dpi);
        const targetHeightPx = Math.round(dimensions.height * dpi);
        
        // Get current element dimensions
        const currentWidth = containerRef.current.offsetWidth;
        const currentHeight = containerRef.current.offsetHeight;
        
        // Calculate required pixel ratio
        const pixelRatio = Math.max(
          targetWidthPx / currentWidth,
          targetHeightPx / currentHeight
        );

        console.log(`Generating ${format.toUpperCase()} with:
          Size: ${size} (${orientation})
          DPI: ${dpi}
          Columns: ${columns}
          Dimensions: ${dimensions.width}"x${dimensions.height}"
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
        link.download = `calendar-2025-${dpi}dpi-${size}-${orientation}.${format}`;
        link.href = dataUrl;
        link.click();

        // Log the final image dimensions
        const img = new Image();
        img.onload = () => {
          console.log(`Final image dimensions: ${img.width}x${img.height}px`);
          console.log(`Effective DPI: ${Math.round(img.width / dimensions.width)}`);
        };
        img.src = dataUrl;

      } catch (error) {
        console.error('Error generating image:', error);
      }
    };

    // Small delay to ensure component is fully rendered
    const timeoutId = setTimeout(generateImage, 100);
    return () => clearTimeout(timeoutId);
  }, [format, size, orientation, columns, dpi, dimensions, testing]);

  // Calculate base size to match paper aspect ratio
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${Math.round(dimensions.width * SCREEN_DPI)}px`,
    height: `${Math.round(dimensions.height * SCREEN_DPI)}px`,
    boxSizing: 'border-box',
    padding: '20px',
    overflow: 'hidden'
  };

  const debugStyle: React.CSSProperties = testing ? {
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
  } : {};

  return (
    <>
      {testing && (
        <div className="debug" style={debugStyle}>
          <div>Size: {size}</div>
          <div>Orientation: {orientation}</div>
          <div>Columns: {columns}</div>
          <div>Dimensions: {dimensions.width}"x{dimensions.height}"</div>
          <div>Pixels: {Math.round(dimensions.width * SCREEN_DPI)}x{Math.round(dimensions.height * SCREEN_DPI)}</div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className={`calendar-print-container size-${size} orientation-${orientation}`} 
        style={baseStyle}
      >
        <Calendar forPrint={true} printColumns={columns} />
      </div>
    </>
  );
};
