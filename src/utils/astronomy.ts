import {
  SearchMoonQuarter,
  SearchSunLongitude,
  MoonQuarter,
  MakeTime,
  SunLongitude,
} from 'astronomy-engine';

export interface AstronomicalEvent {
  date: string;
  type: 'fullMoon' | 'equinox' | 'solstice';
}

export function getFullMoonDates(startYear: number, endYear: number): string[] {
  const dates: string[] = [];
  let time = MakeTime(startYear, 1, 1, 0, 0, 0);
  const endTime = MakeTime(endYear, 12, 31, 23, 59, 59);

  while (time.tt < endTime.tt) {
    const result = SearchMoonQuarter(time);
    if (result.quarter === MoonQuarter.Full) {
      const date = result.time.toString().split('T')[0];
      dates.push(date);
    }
    // Move forward by 20 days to avoid finding the same full moon
    time = MakeTime(time.ut + 20);
  }

  return dates;
}

export function getSolarEvents(startYear: number, endYear: number): AstronomicalEvent[] {
  const events: AstronomicalEvent[] = [];
  let time = MakeTime(startYear, 1, 1, 0, 0, 0);
  const endTime = MakeTime(endYear, 12, 31, 23, 59, 59);

  // Search for equinoxes (0° and 180°) and solstices (90° and 270°)
  const angles = [0, 90, 180, 270];
  
  while (time.tt < endTime.tt) {
    for (const angle of angles) {
      const result = SearchSunLongitude(angle, time);
      const date = result.time.toString().split('T')[0];
      
      let type: 'equinox' | 'solstice';
      if (angle === 0 || angle === 180) {
        type = 'equinox';
      } else {
        type = 'solstice';
      }
      
      events.push({ date, type });
    }
    // Move forward by 80 days to avoid finding the same events
    time = MakeTime(time.ut + 80);
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}
