# Calendar Thing

A responsive calendar application that generates high-quality calendar images with astronomical data integration. Features customizable layouts, multiple paper sizes, and accurate celestial event tracking.

## Features

- RESTful URL interface for viewing and generating calendars
- Astronomical event indicators (moon phases, solstices, equinoxes)
- High-resolution image export (PNG/JPG)
- Multiple paper sizes and orientations
- Responsive layout with configurable grid system

## Usage Guide

### URL Structure

```
/<year>[/month]/<size>/<orientation>[/<dpi>dpi.<format>]
```

Required:
- `year`: Four-digit year (e.g., 2025)
- `size`: Paper size (a6, a5, a4, letter, legal, tabloid)
- `orientation`: Page orientation (portrait, landscape)

Optional:
- `month`: Two-digit month (01-12)
- `dpi`: Resolution for export (default: 300)
- `format`: File format (png, jpg)

### Examples

1. View Calendar:
```
/2025                           # Full year
/2025/letter/portrait          # Specific size/orientation
/2025/01/letter/portrait      # Single month
```

2. Download Calendar:
```
/2025/letter/portrait.png              # PNG at 300dpi
/2025/letter/portrait/600dpi.jpg       # JPG at 600dpi
/2025/01/a4/landscape/300dpi.png      # Single month
```

### Query Parameters

- `header=false`: Hide the year header
- `test=true`: Enable layout debug mode
- `rows=N`: Override default row count
- `columns=N`: Override default column count

### Generated Filenames

When downloading, files are named using this format:
```
YYYY--[MM]--calendar--SIZE--ORIENTATION--DDDdpi.FORMAT

Examples:
2025--calendar--letter--portrait--300dpi.png
2025--01--calendar--a4--landscape--600dpi.jpg
```

### Default Layouts

1. Portrait Orientation:
   - Letter/A4/Legal/Tabloid: 3 columns × 5 rows
   - A5/A6: 3 columns × 4 rows

2. Landscape Orientation:
   - All sizes: 4 columns × 3 rows

### Paper Sizes (at 300 DPI)
- A6: 1240 × 1748 px
- A5: 1748 × 2480 px
- A4: 2480 × 3508 px
- Letter: 2550 × 3300 px
- Legal: 2550 × 4200 px
- Tabloid: 3300 × 5100 px

## Astronomical Features

The calendar displays automatically calculated celestial events:

1. Moon Phases
   - Full moon dates with circular markers
   - Calculated using precise astronomical algorithms

2. Solar Events
   - Spring Equinox (March)
   - Summer Solstice (June)
   - Fall Equinox (September)
   - Winter Solstice (December)

## Tech Stack

- [Astro](https://astro.build/) - Web framework
- [React](https://reactjs.org/) - UI components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [astronomy-engine](https://github.com/cosinekitty/astronomy) - Celestial calculations
- [html-to-image](https://github.com/bubkoo/html-to-image) - Image generation
