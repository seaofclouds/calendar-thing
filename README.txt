# Calendar Thing

A responsive calendar application that generates high-quality calendar images with astronomical data integration. Features customizable layouts, multiple paper sizes, and accurate celestial event tracking.

## Features

- RESTful URL interface for viewing and generating calendars
- Astronomical event indicators (moon phases, solstices, equinoxes)
- High-resolution image export (PNG/JPG)
- Multiple paper sizes and orientations
- Responsive layout with configurable grid system
- Size-specific default layouts
- Test mode for layout preview

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

### Query Parameters

- `header=false`: Hide the year header
- `test=true`: Enable layout debug mode
- `rows=N`: Override default row count

### Generated Filenames

When downloading, files are named using this format:
```
calendar-YYYY-DDDdpi-SIZE-ORIENTATION.FORMAT

Examples:
calendar-2025-300dpi-letter-portrait.png
calendar-2025-600dpi-a4-landscape.jpg
```

### Default Layouts

Each size and orientation has a specific default grid layout:

| Size    | Portrait    | Landscape   |
|---------|-------------|-------------|
| A6      | 4 × 3      | 3 × 4      |
| A5      | 4 × 3      | 3 × 4      |
| A4      | 4 × 3      | 3 × 4      |
| Letter  | 4 × 3      | 3 × 4      |
| Legal   | 5 × 3      | 3 × 5      |
| Tabloid | 5 × 3      | 3 × 5      |

### Examples

1. View Calendar:
```
/2025                               # Full year
/2025/letter/portrait               # Specific size/orientation
```

2. Download Calendar:
```
/2025/letter/portrait/300dpi.png    # PNG at 300dpi
/2025/a6/landscape/600dpi.png       # A6 landscape at 600dpi
```

3. Test and Customize:
```
/2025/a6/portrait/300dpi.png?test=true      # Preview layout
/2025/legal/portrait/600dpi.png?rows=4      # Custom rows
/2025/a4/landscape/300dpi.png?header=false  # No header
```

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
