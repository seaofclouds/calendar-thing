import {
  SearchMoonQuarter,
  NextMoonQuarter,
  MakeTime,
  Seasons,
} from 'astronomy-engine';

export interface AstronomicalEvent {
  date: string;
  type: 'fullMoon' | 'equinox' | 'solstice';
}

function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getFullMoonDates(startYear: number, endYear: number): Promise<string[]> {
  const dates: string[] = [];
  console.log(`Calculating full moons from ${startYear} to ${endYear}`);

  // Start searching from beginning of start year
  let searchTime = MakeTime(startYear, 1, 1, 0, 0, 0);
  
  // Get the first quarter after our start date
  let moonQuarter = SearchMoonQuarter(searchTime);
  
  while (moonQuarter) {
    const date = new Date(moonQuarter.time.toString());
    const year = date.getUTCFullYear();
    
    // Stop if we've gone past our end year
    if (year > endYear) {
      break;
    }
    
    // Only add full moons (quarter = 2)
    if (moonQuarter.quarter === 2) {
      const formattedDate = formatDate(date);
      console.log(`Found full moon on: ${formattedDate}`);
      dates.push(formattedDate);
    }
    
    // Get the next quarter
    moonQuarter = NextMoonQuarter(moonQuarter);
  }

  return dates;
}

export async function getSolarEvents(startYear: number, endYear: number): Promise<string[]> {
  const dates: string[] = [];
  console.log(`Calculating solar events from ${startYear} to ${endYear}`);

  for (let year = startYear; year <= endYear; year++) {
    try {
      // Get all seasons for the year at once
      const seasons = Seasons(year);
      
      // Add each season with proper logging
      const march = new Date(seasons.mar_equinox.toString());
      console.log(`Spring equinox found: ${march}`);
      dates.push(formatDate(march));

      const june = new Date(seasons.jun_solstice.toString());
      console.log(`Summer solstice found: ${june}`);
      dates.push(formatDate(june));

      const sept = new Date(seasons.sep_equinox.toString());
      console.log(`Fall equinox found: ${sept}`);
      dates.push(formatDate(sept));

      const dec = new Date(seasons.dec_solstice.toString());
      console.log(`Winter solstice found: ${dec}`);
      dates.push(formatDate(dec));
    } catch (error) {
      console.error(`Error calculating solar events for ${year}:`, error);
    }
  }

  return dates;
}
