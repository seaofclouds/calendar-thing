/**
 * Format a Date to ICS timestamp format (UTC): YYYYMMDDTHHMMSSZ
 */
export function formatICSTimestamp(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/**
 * Format a YYYY-MM-DD date string to ICS date format: YYYYMMDD
 */
export function formatICSDateValue(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}
