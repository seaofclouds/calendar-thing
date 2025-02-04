import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Calendar } from './components/Calendar';
import { CalendarImage } from './components/CalendarImage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/2025" replace />} />
        <Route path="/2025" element={<Calendar />} />
        <Route path="/2025/png" element={<CalendarImage format="png" />} />
        <Route path="/2025/jpg" element={<CalendarImage format="jpg" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
