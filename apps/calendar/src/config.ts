/**
 * Page configuration — defines paper sizes, layouts, and dimensions.
 * Ported from the original pageConfig.ts.
 */

type Dimension = {
  value: number;
  unit: "in" | "mm";
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
};

export const PAGE_TYPES: Record<string, PageTypeConfig> = {
  letter: {
    dimensions: {
      width: { value: 8.5, unit: "in" },
      height: { value: 11, unit: "in" },
    },
    layout: {
      portrait: { rows: 4, columns: 3 },
      landscape: { rows: 3, columns: 4 },
    },
  },
  legal: {
    dimensions: {
      width: { value: 8.5, unit: "in" },
      height: { value: 14, unit: "in" },
    },
    layout: {
      portrait: { rows: 5, columns: 3 },
      landscape: { rows: 3, columns: 5 },
    },
  },
  tabloid: {
    dimensions: {
      width: { value: 11, unit: "in" },
      height: { value: 17, unit: "in" },
    },
    layout: {
      portrait: { rows: 5, columns: 3 },
      landscape: { rows: 3, columns: 5 },
    },
  },
  "half-tabloid": {
    dimensions: {
      width: { value: 5.5, unit: "in" },
      height: { value: 8.5, unit: "in" },
    },
    layout: {
      portrait: { rows: 3, columns: 2 },
      landscape: { rows: 2, columns: 3 },
    },
  },
  a4: {
    dimensions: {
      width: { value: 210, unit: "mm" },
      height: { value: 297, unit: "mm" },
    },
    layout: {
      portrait: { rows: 4, columns: 3 },
      landscape: { rows: 3, columns: 4 },
    },
  },
  a5: {
    dimensions: {
      width: { value: 148, unit: "mm" },
      height: { value: 210, unit: "mm" },
    },
    layout: {
      portrait: { rows: 4, columns: 3 },
      landscape: { rows: 3, columns: 4 },
    },
  },
  a6: {
    dimensions: {
      width: { value: 105, unit: "mm" },
      height: { value: 148, unit: "mm" },
    },
    layout: {
      portrait: { rows: 4, columns: 3 },
      landscape: { rows: 3, columns: 4 },
    },
  },
};

export function getPageLayout(
  pageType: string,
  orientation: "portrait" | "landscape"
): PageLayout {
  const config = PAGE_TYPES[pageType.toLowerCase()];
  return config?.layout[orientation] ?? PAGE_TYPES.letter.layout.portrait;
}
