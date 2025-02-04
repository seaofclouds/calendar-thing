# Calendar Thing

A responsive calendar application that generates high-quality calendar images for various paper sizes and orientations. Features astronomical data integration for accurate celestial event tracking.

## Features

- Parameterized year selection via URL (e.g., `/2025`, `/2026`)
- Astronomical event indicators:
  - Full moon phases (calculated using astronomy-engine)
  - Solstices (Summer and Winter)
  - Equinoxes (Spring and Fall)
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

- `rows`: Number of months per column
  - Range: 1-5
  - Example: `?rows=4`

- `dpi`: Resolution in dots per inch (default: 300)
  - Range: 72-600
  - Example: `?dpi=300`

- `testing`: Enable layout testing mode (default: false)
  - Options: true, false
  - Example: `?testing=true`
  - Adds visual indicators for container boundaries

## Astronomical Features

The calendar incorporates astronomical calculations using the astronomy-engine library to display celestial events:

### Full Moon Indicators
- Automatically calculated for the selected year
- Displayed as circular markers on the corresponding dates
- Updates dynamically when changing years

### Solar Events
- Spring Equinox (March)
- Summer Solstice (June)
- Fall Equinox (September)
- Winter Solstice (December)
- Displayed as diamond-shaped markers on the corresponding dates

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
- Uses relative units (em/rem) for consistent scaling

### Grid System
- Flexible month grid with configurable columns and rows
- Proportional day cells that maintain aspect ratio
- Consistent spacing between months and elements

### Visual Indicators
- Day markers (full moon, solstice, equinox) scale with text size
- Clear visual hierarchy with proportional header sizes
- Optional testing mode for layout visualization

## Examples

Generate a calendar for 2026:
```
/2026
```

View calendar for 2025 without the year header:
```
/2025?header=off
```

Generate a 4-column landscape A4 calendar at 300 DPI:
```
/2025/png?size=a4&orientation=landscape&columns=4&dpi=300
```

Create a high-resolution tabloid calendar with testing mode:
```
/2025/png?size=tabloid&header=on&orientation=portrait&rows=5&columns=3&dpi=300&testing=on
```

Generate a compact A6 calendar with testing indicators:
```
/2025/png?size=a6&header=on&orientation=portrait&rows=4&columns=3&dpi=300&testing=on
```

## Technical Details

### Astronomical Calculations
The calendar uses the astronomy-engine library to calculate:
- Full moon phases using `SearchMoonQuarter` and `NextMoonQuarter`
- Solstices and equinoxes using the `Seasons` function
- All calculations are performed in UTC to ensure accuracy

### Year Parameterization
- Default year is 2025 if not specified
- Supports any valid year through the URL parameter
- Automatically calculates astronomical events for the selected year
- Displays 15 months starting from January of the selected year
