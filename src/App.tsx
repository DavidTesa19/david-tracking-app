import { useState } from 'react';
import MonthNavigator from './components/MonthNavigator';
import SleepTrackingSection from './components/SleepTrackingSection';
import Modal from './components/Modal';
import SleepDataForm from './components/SleepDataForm';
import { getCurrentMonthYear } from './utils/dateUtils';
import { getMonthData, updateDataForDate } from './utils/storage';
import { SleepData } from './types/tracking';
import './App.css';

function App() {
  const [currentDate, setCurrentDate] = useState(getCurrentMonthYear());
  const [monthData, setMonthData] = useState(getMonthData(currentDate.year, currentDate.month));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleMonthChange = (year: number, month: number) => {
    setCurrentDate({ year, month });
    setMonthData(getMonthData(year, month));
  };

  const handleCellClick = (date: string, _metric: keyof SleepData) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSaveSleepData = (sleepData: SleepData) => {
    updateDataForDate(selectedDate, { sleep: sleepData });
    // Refresh the month data
    setMonthData(getMonthData(currentDate.year, currentDate.month));
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate('');
  };

  // Extract sleep data from monthly data
  const sleepData: { [date: string]: SleepData } = {};
  Object.keys(monthData).forEach(date => {
    if (monthData[date].sleep) {
      sleepData[date] = monthData[date].sleep!;
    }
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-[100vw] mx-auto">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏃‍♂️ David's Tracking System
          </h1>
          <p className="text-gray-600">
            Comprehensive health & fitness tracking with automated data sync
          </p>
        </header>

        <MonthNavigator onMonthChange={handleMonthChange} />

        <SleepTrackingSection
          year={currentDate.year}
          month={currentDate.month}
          sleepData={sleepData}
          onCellClick={handleCellClick}
        />

        {/* Sleep Data Entry Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="😴 Edit Sleep Data"
        >
          <SleepDataForm
            date={selectedDate}
            initialData={sleepData[selectedDate]}
            onSave={handleSaveSleepData}
            onCancel={handleCloseModal}
          />
        </Modal>

        {/* TODO: Add more sections: Diet, Calories, Other Metrics */}
      </div>
    </div>
  );
}

export default App;
