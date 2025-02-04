Calendar Thing
=============

A minimalist calendar application that displays a full year view with astronomical events. Built with React and TypeScript, the app shows full moons, solstices, and equinoxes as visual markers on their respective dates.

Features
--------
- Clean, minimal calendar display
- Multiple months visible in a responsive grid layout
- Full moon indicators displayed as black circles
- Solstice and equinox markers shown as rotated squares (diamonds)
- Responsive design that adjusts columns based on viewport width

Planned Features
---------------

0. Style improvements
   - more responsive - more than 3 columns possible.
   - possibly nicer typeface

1. PDF Generation via URL Parameters
   - Support multiple paper sizes:
     * A6
     * A5
     * Letter
     * Legal
     * Tabloid
   - Both portrait and landscape orientations
   - Custom page sizes (begin with ?size=letter&orientation=landscape&width=half)
   - Custom margins (top, bottom, left, right)
   - Alternative: High-resolution (600dpi) canvas export for print

2. URL Parameter Controls
   - Generate calendar for specific years
   - Toggle visibility of astronomical events (full moons, solstices/equinoxes)
   - Control calendar layout and display options

3. Static Asset Generation
   - Pre-generate PDFs for common configurations
   - Host generated PDFs statically for improved performance

4. Cloudflare Deployment
   - Deploy application to Cloudflare Pages

Technical Notes
--------------
- Built with React + TypeScript + Vite
- Minimal dependencies for fast loading
- CSS-based astronomical markers for crisp rendering
- Mobile-responsive design

Astronomical Events (2025-2026)
-----------------------------
Equinoxes:
- March 20, 2025
- September 22, 2025
- March 20, 2026

Solstices:
- June 21, 2025
- December 21, 2025
- June 21, 2026
