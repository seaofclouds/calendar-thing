import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';

interface DayData {
  date: number;
  currentMonth: boolean;
  fullMoon: boolean;
  isSpecialDay?: 'solstice' | 'equinox';
}

export const Calendar: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Full moon dates for 2025-2026 (UTC)
  const fullMoonDates = [
    '2025-01-13', '2025-02-12', '2025-03-14', '2025-04-12',
    '2025-05-12', '2025-06-11', '2025-07-10', '2025-08-09',
    '2025-09-07', '2025-10-06', '2025-11-05', '2025-12-04',
    '2026-01-03', '2026-02-01', '2026-03-03'
  ];

  // Solstice and Equinox dates
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
    { month: 2, year: 2026 }
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

    return monthData;
  };

  const generatePDF = () => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // PDF generation logic will be implemented here
    pdf.text('15 Month Calendar (2025-2026)', 10, 10);
    
    // Save the PDF
    pdf.save('15-month-calendar.pdf');
  };

  // Determine number of columns based on window width
  const getColumnCount = () => {
    if (windowWidth < 768) return 1;
    if (windowWidth < 1024) return 2;
    if (windowWidth < 1440) return 3;
    return 4;
  };

  return (
    <div className="calendar-container">
      <div className="calendar" style={{ gridTemplateColumns: `repeat(${getColumnCount()}, 1fr)` }}>
        {months.map(({ month, year }) => (
          <div key={`${year}-${month}`} className="month">
            <div className="month-header">
              {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}
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
                  {day.fullMoon && <div className="full-moon" />}
                  {day.isSpecialDay && (
                    <div className={`${day.isSpecialDay}-marker`} />
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
