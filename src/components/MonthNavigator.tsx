import { useState } from 'react';
import { getCurrentMonthYear, getMonthName } from '../utils/dateUtils';

interface MonthNavigatorProps {
  onMonthChange: (year: number, month: number) => void;
}

const MonthNavigator = ({ onMonthChange }: MonthNavigatorProps) => {
  const [currentDate, setCurrentDate] = useState(getCurrentMonthYear());

  const handlePrevMonth = () => {
    const newMonth = currentDate.month === 0 ? 11 : currentDate.month - 1;
    const newYear = currentDate.month === 0 ? currentDate.year - 1 : currentDate.year;
    
    setCurrentDate({ month: newMonth, year: newYear });
    onMonthChange(newYear, newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = currentDate.month === 11 ? 0 : currentDate.month + 1;
    const newYear = currentDate.month === 11 ? currentDate.year + 1 : currentDate.year;
    
    setCurrentDate({ month: newMonth, year: newYear });
    onMonthChange(newYear, newMonth);
  };

  const handleToday = () => {
    const today = getCurrentMonthYear();
    setCurrentDate(today);
    onMonthChange(today.year, today.month);
  };

  return (
    <div className="flex items-center justify-between bg-white shadow-sm rounded-lg p-4 mb-4">
      <button
        onClick={handlePrevMonth}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        ← Previous
      </button>
      
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {getMonthName(currentDate.month)} {currentDate.year}
        </h2>
        <button
          onClick={handleToday}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
        >
          Today
        </button>
      </div>
      
      <button
        onClick={handleNextMonth}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Next →
      </button>
    </div>
  );
};

export default MonthNavigator;
