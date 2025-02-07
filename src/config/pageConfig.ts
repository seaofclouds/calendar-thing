type Dimension = {
  value: number;
  unit: 'in' | 'mm';
};

type PageLayout = {
  rows: number;
  columns: number;
};

type OrientationConfig = {
  portrait: PageLayout;
  landscape: PageLayout;
};

type PageTypeConfig = {
  dimensions: {
    width: Dimension;
    height: Dimension;
  };
  layout: OrientationConfig;
  margins?: {
    top: Dimension;
    right: Dimension;
    bottom: Dimension;
    left: Dimension;
  };
  // Add any additional page-specific configurations here
  gridGap?: Dimension;
  minFontSize?: Dimension;
};

// Standard print and screen DPI values
export const TARGET_DPI = 192; // 600 dpi eventually, 192 while testing
export const SCREEN_DPI = 96;

export const PAGE_TYPES: Record<string, PageTypeConfig> = {
  letter: {
    dimensions: {
      width: { value: 8.5, unit: 'in' },
      height: { value: 11, unit: 'in' }
    },
    layout: {
      portrait: { rows: 4, columns: 3 },
      landscape: { rows: 3, columns: 4 }
    },
    margins: {
      top: { value: 0.5, unit: 'in' },
      right: { value: 0.5, unit: 'in' },
      bottom: { value: 0.5, unit: 'in' },
      left: { value: 0.5, unit: 'in' }
    },
    gridGap: { value: 1, unit: 'in' }
  },
  legal: {
    dimensions: {
      width: { value: 8.5, unit: 'in' },
      height: { value: 14, unit: 'in' }
    },
    layout: {
      portrait: { rows: 5, columns: 3 },
      landscape: { rows: 3, columns: 5 }
    },
    margins: {
      top: { value: 0.5, unit: 'in' },
      right: { value: 0.5, unit: 'in' },
      bottom: { value: 0.5, unit: 'in' },
      left: { value: 0.5, unit: 'in' }
    }
  },
  tabloid: {
    dimensions: {
      width: { value: 11, unit: 'in' },
      height: { value: 17, unit: 'in' }
    },
    layout: {
      portrait: { rows: 5, columns: 3 },
      landscape: { rows: 3, columns: 5 }
    }
  },
  'half-tabloid': {
    dimensions: {
      width: { value: 5.5, unit: 'in' },
      height: { value: 8.5, unit: 'in' }
    },
    layout: {
      portrait: { rows: 3, columns: 2 },
      landscape: { rows: 2, columns: 3 }
    }
  },
  a4: {
    dimensions: {
      width: { value: 210, unit: 'mm' },
      height: { value: 297, unit: 'mm' }
    },
    layout: {
      portrait: { rows: 4, columns: 3 },
      landscape: { rows: 3, columns: 4 }
    }
  },
  a5: {
    dimensions: {
      width: { value: 148, unit: 'mm' },
      height: { value: 210, unit: 'mm' }
    },
    layout: {
      portrait: { rows: 4, columns: 3 },
      landscape: { rows: 3, columns: 4 }
    }
  },
  a6: {
    dimensions: {
      width: { value: 105, unit: 'mm' },
      height: { value: 148, unit: 'mm' }
    },
    layout: {
      portrait: { rows: 4, columns: 3 },
      landscape: { rows: 3, columns: 4 }
    }
  }
};

// Helper functions
export function getPageConfig(pageType: string): PageTypeConfig | undefined {
  return PAGE_TYPES[pageType.toLowerCase()];
}

export function getPageLayout(pageType: string, orientation: 'portrait' | 'landscape'): PageLayout {
  const config = getPageConfig(pageType);
  return config?.layout[orientation] ?? PAGE_TYPES.letter.layout.portrait;
}

export function getPageDimensions(pageType: string): { width: Dimension; height: Dimension } {
  const config = getPageConfig(pageType);
  return config?.dimensions ?? PAGE_TYPES.letter.dimensions;
}

// Convert dimensions between units
export function convertDimension(dim: Dimension, toUnit: 'in' | 'mm'): Dimension {
  if (dim.unit === toUnit) return dim;
  
  if (dim.unit === 'in' && toUnit === 'mm') {
    return { value: dim.value * 25.4, unit: 'mm' };
  } else if (dim.unit === 'mm' && toUnit === 'in') {
    return { value: dim.value / 25.4, unit: 'in' };
  }
  
  return dim;
}

// Create a new page type configuration
export function createPageType(
  name: string, 
  config: PageTypeConfig
): void {
  if (PAGE_TYPES[name]) {
    console.warn(`Page type "${name}" already exists and will be overwritten.`);
  }
  PAGE_TYPES[name] = config;
}
