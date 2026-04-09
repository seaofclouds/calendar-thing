export interface MoonPhaseEntry {
  date: string;
  phase: "new_moon" | "first_quarter" | "full_moon" | "last_quarter";
  name: string;
  emoji: string;
}

export interface MovieRelease {
  title: string;
  date: string;
}
