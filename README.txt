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
/2025                               # Full year
/2025/letter/portrait               # Specific size/orientation
```

2. Download Calendar:
```
/2025/letter/portrait.png            # PNG at 300dpi
/2025/letter/portrait/600dpi.jpg     # JPG at 600dpi
```

### Query Parameters

- `header=false`: Hide the year header
- `test=true`: Enable layout debug mode
- `rows=N`: Override default row count
- `columns=N`: Override default column count

### Generated Filenames

When downloading, files are named using this format:
```
YYYY--calendar--SIZE--ORIENTATION--DDDdpi.FORMAT

Examples:
2025--calendar--letter--portrait--300dpi.png
2025--calendar--a4--landscape--600dpi.jpg
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

## Deployment

This project is deployed on Cloudflare Pages with server-side rendering (SSR) enabled.

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Deployment Process
The project uses Git-based deployments through Cloudflare Pages with the following configuration:

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`

To deploy:
1. Push changes to the repository
2. Cloudflare Pages will automatically build and deploy the site
3. Monitor the deployment in the Cloudflare Pages dashboard

Note: While the project includes a `deploy` script, it's recommended to use Git-based deployment through Cloudflare Pages instead of manual deployments.

## Upcoming Features

- Monthly view: /2025/01/letter/portrait
- Download Month:2025/01/a4/landscape/300dpi.png
- load event dates into monthly view.
