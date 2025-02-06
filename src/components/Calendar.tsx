import React, { useEffect, useState, forwardRef, useMemo } from 'react';
import { getFullMoonDates, getSolarEvents, AstronomicalEvent } from '../utils/astronomy';
import { getPageLayout } from '../config/pageConfig';

interface CalendarProps {
  year?: number;
  forPrint?: boolean;
  printColumns?: number;
  rows?: number;
  size?: string;
  orientation?: 'portrait' | 'landscape';
  header?: boolean;
  testing?: boolean;
}

interface DayData {
  date: number;
  currentMonth: boolean;
  fullMoon: boolean;
  isSpecialDay?: 'solstice' | 'equinox';
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(({ 
  year = new Date().getFullYear(),
  forPrint = false, 
  printColumns = 3,
  rows,
  size = 'letter',
  orientation = 'portrait',
  header = true,
  testing = false
}, ref) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [columnCount, setColumnCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const showYearHeader = header;

  // Use configuration from pageConfig
  const defaultLayout = getPageLayout(size, orientation);
  const actualRows = rows ?? defaultLayout.rows;
  
  // Calculate total months based on rows and columns
  const totalMonths = actualRows * (orientation === 'landscape' ? 4 : 3);

  // Calculate astronomical events
  const [fullMoonDates, setFullMoonDates] = useState<string[]>([]);
  const [solarEvents, setSolarEvents] = useState<Record<string, 'solstice' | 'equinox'>>({});

  // Parse year parameter or default to current year
  const baseYear = year;
  const nextYear = baseYear + 1;

  // Fetch astronomical data
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getFullMoonDates(baseYear, nextYear),
      getSolarEvents(baseYear, nextYear)
    ]).then(([moons, events]) => {
      setFullMoonDates(moons);
      
      const eventMap: Record<string, 'solstice' | 'equinox'> = {};
      events.forEach(date => {
        const month = parseInt(date.split('-')[1]);
        const type = (month === 3 || month === 9) ? 'equinox' : 'solstice';
        eventMap[date] = type;
      });
      
      setSolarEvents(eventMap);
      setIsLoading(false);
    }).catch(error => {
      console.error('Error fetching astronomical data:', error);
      setIsLoading(false);
    });
  }, [baseYear, nextYear]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let cols = 1;

      if (testing || forPrint) {
        cols = orientation === 'landscape' ? 4 : 3;
      } else {
        if (width >= 1200) cols = 4;
        else if (width >= 900) cols = 3;
        else if (width >= 600) cols = 2;
      }

      setWindowWidth(width);
      setColumnCount(cols);
    };
    
    handleResize();
    if (!forPrint) {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [forPrint, orientation, testing]);

  // Generate all month data at once
  const monthsData = useMemo(() => {
    const months = Array.from({ length: totalMonths }, (_, i) => {
      const monthIndex = i % 12;
      const yearOffset = Math.floor(i / 12);
      return {
        month: monthIndex,
        year: baseYear + yearOffset
      };
    });

    return months.map(({ month, year }) => {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const previousMonthLastDay = new Date(year, month, 0);
      
      const daysInMonth = lastDay.getDate();
      const startingDay = firstDay.getDay();
      const previousMonthDays = previousMonthLastDay.getDate();

      const monthData: DayData[][] = [];
      let currentWeek: DayData[] = [];

      // Previous month days
      for (let i = 0; i < startingDay; i++) {
        currentWeek.push({
          date: previousMonthDays - startingDay + i + 1,
          currentMonth: false,
          fullMoon: false
        });
      }

      // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // Only check astronomical events if we have the data
        const isFullMoon = !isLoading && fullMoonDates.includes(dateString);
        const specialDay = !isLoading ? solarEvents[dateString] : undefined;

        currentWeek.push({
          date: day,
          currentMonth: true,
          fullMoon: isFullMoon,
          isSpecialDay: specialDay
        });

        if (currentWeek.length === 7) {
          monthData.push(currentWeek);
          currentWeek = [];
        }
      }

      // Next month days
      let nextMonthDay = 1;
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: nextMonthDay++,
          currentMonth: false,
          fullMoon: false
        });
      }
      if (currentWeek.length > 0) {
        monthData.push(currentWeek);
      }

      return {
        name: new Date(year, month).toLocaleString('default', { month: 'long' }),
        data: monthData,
        key: `${year}-${month}`
      };
    });
  }, [totalMonths, baseYear, fullMoonDates, solarEvents, isLoading]);

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const calendarStyle = {
    '--print-columns': testing || forPrint ? (orientation === 'landscape' ? 4 : 3) : columnCount
  } as React.CSSProperties;

  return (
    <div ref={ref} className={`calendar ${forPrint ? 'print' : ''}`} style={calendarStyle}>
      {showYearHeader && (
        <div className="calendar-header">
          <h1>{baseYear}</h1>
        </div>
      )}
      <div className="calendar-grid">
        {monthsData.map(({ name, data, key }) => (
          <div key={key} className="month">
            <div className="month-header">
              <h2>{name}</h2>
            </div>
            <div className="week-days">
              {weekDays.map((day, index) => (
                <h3 key={index} className="week-day">{day}</h3>
              ))}
            </div>
            <div className="month-grid">
              {data.flat().map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`calendar-day${!day.currentMonth ? ' other-month' : ''}`}
                >
                  {!day.fullMoon && !day.isSpecialDay && (
                    <span className="date">{day.date}</span>
                  )}
                  {day.fullMoon && <div className="day-marker-moon-full" />}
                  {day.isSpecialDay && (
                    <div className={`day-marker-${day.isSpecialDay}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
