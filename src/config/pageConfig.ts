interface PageDimensions {
  width: number;
  height: number;
}

interface PageLayout {
  rows: number;
  columns: number;
}

interface OrientationLayout {
  portrait: PageLayout;
  landscape: PageLayout;
}

export const PAPER_SIZES: Record<string, PageDimensions> = {
  letter: { width: 8.5, height: 11 },
  legal: { width: 8.5, height: 14 },
  tabloid: { width: 11, height: 17 },
  a6: { width: 4.125, height: 5.875 },
  a5: { width: 5.8, height: 8.27 },
  a4: { width: 8.27, height: 11.69 }
};

export const PAGE_LAYOUTS: Record<string, OrientationLayout> = {
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

// Standard print and screen DPI values
export const TARGET_DPI = 192; // 600 dpi eventually, 192 while testing
export const SCREEN_DPI = 96;

// Helper functions
export const getPageLayout = (size: string, orientation: 'portrait' | 'landscape'): PageLayout => {
  const sizeKey = size.toLowerCase();
  return PAGE_LAYOUTS[sizeKey]?.[orientation] ?? PAGE_LAYOUTS.letter.portrait;
};

export const getPageDimensions = (size: string): PageDimensions => {
  const sizeKey = size.toLowerCase();
  return PAPER_SIZES[sizeKey] ?? PAPER_SIZES.letter;
};
