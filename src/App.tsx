import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Calendar } from './components/Calendar';
import { CalendarImage } from './components/CalendarImage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/2025/view" replace />} />
        <Route path="/:year/view" element={<Calendar />} />
        <Route path="/:year/png" element={<CalendarImage format="png" />} />
        <Route path="/:year/jpg" element={<CalendarImage format="jpg" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
