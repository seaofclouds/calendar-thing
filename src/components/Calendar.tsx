import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { getFullMoonDates, getSolarEvents, AstronomicalEvent } from '../utils/astronomy';

interface DayData {
  date: number;
  currentMonth: boolean;
  fullMoon: boolean;
  isSpecialDay?: 'solstice' | 'equinox';
}

export const Calendar: React.FC<{ 
  forPrint?: boolean, 
  printColumns?: number
}> = ({ 
  forPrint = false, 
  printColumns = 3
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [visibleMonths, setVisibleMonths] = useState(14); 
  const [columnCount, setColumnCount] = useState(1);
  const [searchParams] = useSearchParams();
  const { year: yearParam } = useParams();
  const showYearHeader = searchParams.get('header') !== 'off';

  // Parse year parameter or default to current year
  const baseYear = parseInt(yearParam || '2025', 10);
  const nextYear = baseYear + 1;

  // Calculate astronomical events
  const [fullMoonDates, setFullMoonDates] = useState<string[]>([]);
  const [solarEvents, setSolarEvents] = useState<Record<string, 'solstice' | 'equinox'>>({});

  useEffect(() => {
    console.log('Calculating astronomical events for year:', baseYear);
    try {
      const moons = getFullMoonDates(baseYear, nextYear);
      console.log('Full moon dates:', moons);
      setFullMoonDates(moons);

      const events = getSolarEvents(baseYear, nextYear);
      console.log('Solar events:', events);
      const eventMap: Record<string, 'solstice' | 'equinox'> = {};
      events.forEach(event => {
        eventMap[event.date] = event.type;
      });
      setSolarEvents(eventMap);
    } catch (error) {
      console.error('Error calculating astronomical events:', error);
    }
  }, [baseYear, nextYear]);

  useEffect(() => {
    const handleResize = () => {
      if (forPrint) {
        const months = printColumns * Math.ceil(14 / printColumns);
        setColumnCount(printColumns);
        setVisibleMonths(months);
        return;
      }

      const width = window.innerWidth;
      let columns = 1;
      let months = 14;

      if (width >= 1200) {
        columns = 4;
        months = 16;
      } else if (width >= 900) {
        columns = 3;
        months = 15;
      } else if (width >= 600) {
        columns = 2;
        months = 14;
      }

      setWindowWidth(width);
      setColumnCount(columns);
      setVisibleMonths(months);
    };
    
    handleResize(); 
    if (!forPrint) {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [forPrint, printColumns]);

  const months = Array.from({ length: 18 }, (_, i) => {
    const monthIndex = i % 12;
    const yearOffset = Math.floor(i / 12);
    const year = baseYear + yearOffset;
    console.log(`Generating month ${monthIndex + 1} for year ${year}`);
    return {
      month: monthIndex,
      year
    };
  });

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getMonthData = (month: number, year: number): DayData[][] => {
    console.log(`Getting data for month ${month + 1}, year ${year}`);
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const previousMonthLastDay = new Date(year, month, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const previousMonthDays = previousMonthLastDay.getDate();

    const monthData: DayData[][] = [];
    let currentWeek: DayData[] = [];

    for (let i = 0; i < startingDay; i++) {
      currentWeek.push({
        date: previousMonthDays - startingDay + i + 1,
        currentMonth: false,
        fullMoon: false
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isFullMoon = fullMoonDates.includes(dateString);
      const specialDay = solarEvents[dateString];

      if (isFullMoon || specialDay) {
        console.log(`Found event on ${dateString}:`, { isFullMoon, specialDay });
      }

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

    return monthData;
  };

  const calendarStyle = {
    '--print-columns': forPrint ? printColumns : columnCount
  } as React.CSSProperties;

  return (
    <div className={`calendar ${forPrint ? 'print' : ''}`} style={calendarStyle}>
      {showYearHeader && (
        <div className="calendar-header">
          <h1>{baseYear}</h1>
        </div>
      )}
      <div className="calendar-grid">
        {months.slice(0, visibleMonths).map(({ month, year }) => (
          <div key={`${year}-${month}`} className="month">
            <div className="month-header">
              <h2>
                {new Date(year, month).toLocaleString('default', { month: 'long' })}
              </h2>
            </div>
            <div className="week-days">
              {weekDays.map((day, index) => (
                <h3 key={index} className="week-day">{day}</h3>
              ))}
            </div>
            <div className="month-grid">
              {getMonthData(month, year).flat().map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`calendar-day${!day.currentMonth ? ' other-month' : ''}`}
                >
                  {day.fullMoon && <div className="day-marker-moon-full" />}
                  {day.isSpecialDay && (
                    <div className={`day-marker-${day.isSpecialDay}`} />
                  )}
                  {!day.fullMoon && !day.isSpecialDay && (
                    <span className="date">{day.date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
