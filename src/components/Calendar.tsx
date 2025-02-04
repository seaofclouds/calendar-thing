import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  const showYearHeader = searchParams.get('yearheader') === 'true';

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

  const fullMoonDates = [
    '2025-01-13', '2025-02-12', '2025-03-14', '2025-04-12',
    '2025-05-12', '2025-06-11', '2025-07-10', '2025-08-09',
    '2025-09-07', '2025-10-06', '2025-11-05', '2025-12-04',
    '2026-01-03', '2026-02-01', '2026-03-03', '2026-04-01'
  ];

  const specialDates = {
    '2025-03-20': 'equinox',
    '2025-06-21': 'solstice',
    '2025-09-22': 'equinox',
    '2025-12-21': 'solstice',
    '2026-03-20': 'equinox',
    '2026-06-21': 'solstice'
  } as const;

  const months = [
    { month: 0, year: 2025 },
    { month: 1, year: 2025 },
    { month: 2, year: 2025 },
    { month: 3, year: 2025 },
    { month: 4, year: 2025 },
    { month: 5, year: 2025 },
    { month: 6, year: 2025 },
    { month: 7, year: 2025 },
    { month: 8, year: 2025 },
    { month: 9, year: 2025 },
    { month: 10, year: 2025 },
    { month: 11, year: 2025 },
    { month: 0, year: 2026 },
    { month: 1, year: 2026 },
    { month: 2, year: 2026 },
    { month: 3, year: 2026 },
    { month: 4, year: 2026 },
    { month: 5, year: 2026 }
  ];

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getMonthData = (month: number, year: number): DayData[][] => {
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
      const specialDay = specialDates[dateString as keyof typeof specialDates];

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
          {months[0].year}
        </div>
      )}
      <div className="calendar-grid">
        {months.slice(0, visibleMonths).map(({ month, year }) => (
          <div key={`${year}-${month}`} className="month">
            <div className="month-header">
              {new Date(year, month).toLocaleString('default', { month: 'long' })}
            </div>
            <div className="week-days">
              {weekDays.map((day, index) => (
                <div key={index} className="week-day">{day}</div>
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
