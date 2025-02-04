# Calendar Thing

A responsive calendar application that generates high-quality calendar images for various paper sizes and orientations.

## Features

- 15-month calendar view (2025-2026)
- Full moon, solstice, and equinox indicators
- Responsive layout that adapts to different screen sizes
- High-resolution image export (PNG/JPG)
- Multiple paper size support
- Portrait and landscape orientations

## URL Structure

The application supports the following URL patterns:

- `/:year` - View calendar for specified year (e.g., `/2025`)
- `/:year/png` - Export calendar as PNG (e.g., `/2025/png`)
- `/:year/jpg` - Export calendar as JPG (e.g., `/2025/jpg`)

## URL Parameters

The application supports the following URL parameters for customizing the calendar layout:

- `header`: Control year header visibility (default: on)
  - Options: on, off
  - Example: `?header=off`

- `size`: Paper size (default: letter)
  - Options: a6, a5, a4, letter, legal, tabloid
  - Example: `?size=a4`

- `orientation`: Page orientation (default: portrait)
  - Options: portrait, landscape
  - Example: `?orientation=landscape`

- `columns`: Number of months per row (default: 3)
  - Range: 1-5
  - Example: `?columns=4`

- `dpi`: Resolution in dots per inch (default: 300)
  - Range: 72-600
  - Example: `?dpi=300`

- `testing`: Enable layout testing mode (default: false)
  - Options: true, false
  - Example: `?testing=true`
  - Adds visual indicators for container boundaries

## Image Export

The application can generate high-quality PNG and JPG images of the calendar. The export resolution is controlled by the `dpi` parameter.

### Resolution Guidelines
- Screen viewing: 72-150 DPI
- Standard printing: 300 DPI
- High-quality printing: 600 DPI

### Paper Size Dimensions (in pixels at 300 DPI)
- A6: 1240 × 1748 pixels
- A5: 1748 × 2480 pixels
- A4: 2480 × 3508 pixels
- Letter: 2550 × 3300 pixels
- Legal: 2550 × 4200 pixels
- Tabloid: 3300 × 5100 pixels

## Layout Features

### Responsive Design
- Automatically adjusts font sizes for different paper formats
- Maintains proper spacing ratios across all sizes
- Uses relative units (em) for consistent scaling

### Grid System
- Flexible month grid with configurable columns
- Proportional day cells that maintain aspect ratio
- Consistent spacing between months and elements

### Visual Indicators
- Day markers (full moon, solstice, equinox) scale with text size
- Clear visual hierarchy with proportional header sizes
- Optional testing mode for layout visualization

## Examples

View calendar for 2025 without the year header:
```
/2025?header=off
```

Generate a 4-column landscape A4 calendar at 300 DPI:
```
/2025/png?size=a4&orientation=landscape&columns=4&dpi=300
```

Create a high-resolution tabloid calendar for printing:
```
/2025/png?size=tabloid&orientation=portrait&dpi=600
```

## Roadmap
- Parameterize year and calendar generation
- use astronomical data for full moon, solstice, and equinox indicators
- consider font options for fun rendering.

## Development

Built with:
- React
- TypeScript
- CSS Grid/Flexbox
- html-to-image for export functionality
