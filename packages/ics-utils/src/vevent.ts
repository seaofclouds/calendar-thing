/**
 * Build a single VEVENT block for an ICS calendar.
 */
export interface VEventOptions {
  uid: string;
  dtstamp: string;
  dtstart: string;
  dtend?: string;
  summary: string;
  description?: string;
  url?: string;
  transp?: string;
}

export function buildVEvent(opts: VEventOptions): string {
  const lines = [
    "BEGIN:VEVENT",
    `UID:${opts.uid}`,
    `DTSTAMP:${opts.dtstamp}`,
    `DTSTART;VALUE=DATE:${opts.dtstart}`,
    `DTEND;VALUE=DATE:${opts.dtend ?? opts.dtstart}`,
    `SUMMARY:${opts.summary}`,
  ];

  if (opts.description) {
    lines.push(`DESCRIPTION:${opts.description}`);
  }

  if (opts.url) {
    lines.push(`URL:${opts.url}`);
  }

  lines.push(`TRANSP:${opts.transp ?? "TRANSPARENT"}`);
  lines.push("END:VEVENT");

  return lines.join("\r\n");
}
