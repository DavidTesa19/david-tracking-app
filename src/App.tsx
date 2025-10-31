import { useState } from 'react';
import MonthNavigator from './components/MonthNavigator';
import SleepTrackingSection from './components/SleepTrackingSection';
import DietTrackingSection from './components/DietTrackingSection';
import OtherMetricsSection from './components/OtherMetricsSection';
import FitbitSyncPanel from './components/FitbitSyncPanel';
import Modal from './components/Modal';
import SleepDataForm from './components/SleepDataForm';
import DietDataForm from './components/DietDataForm';
import OtherMetricsForm from './components/OtherMetricsForm';
import { getCurrentMonthYear } from './utils/dateUtils';
import { getMonthData, updateDataForDate } from './utils/storage';
import { generateOctoberSampleData, clearSampleData } from './utils/sampleData';
import { SleepData, DietData, CaloriesData, OtherMetrics } from './types/tracking';
import './App.css';

type ModalType = 'sleep' | 'diet' | 'other' | null;

function App() {
  const [currentDate, setCurrentDate] = useState(getCurrentMonthYear());
  const [monthData, setMonthData] = useState(getMonthData(currentDate.year, currentDate.month));
  
  const refreshData = () => {
    setMonthData(getMonthData(currentDate.year, currentDate.month));
  };
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleMonthChange = (year: number, month: number) => {
    setCurrentDate({ year, month });
    setMonthData(getMonthData(year, month));
  };

  const handleSleepCellClick = (date: string, _metric: keyof SleepData) => {
    setSelectedDate(date);
    setModalType('sleep');
  };

  const handleDietCellClick = (date: string, _section: 'diet' | 'calories') => {
    setSelectedDate(date);
    setModalType('diet');
  };

  const handleOtherCellClick = (date: string) => {
    setSelectedDate(date);
    setModalType('other');
  };

  const handleSaveSleepData = (sleepData: SleepData) => {
    updateDataForDate(selectedDate, { sleep: sleepData });
    setMonthData(getMonthData(currentDate.year, currentDate.month));
    setModalType(null);
  };

  const handleSaveDietData = (dietData: DietData, caloriesData: CaloriesData) => {
    updateDataForDate(selectedDate, { diet: dietData, calories: caloriesData });
    setMonthData(getMonthData(currentDate.year, currentDate.month));
    setModalType(null);
  };

  const handleSaveOtherMetrics = (otherData: OtherMetrics) => {
    updateDataForDate(selectedDate, { other: otherData });
    setMonthData(getMonthData(currentDate.year, currentDate.month));
    setModalType(null);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedDate('');
  };

  const handleLoadSampleData = () => {
    generateOctoberSampleData();
    setMonthData(getMonthData(currentDate.year, currentDate.month));
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearSampleData();
      setMonthData({});
    }
  };

  // Extract data from monthly data
  const sleepData: { [date: string]: SleepData } = {};
  const dietData: { [date: string]: DietData } = {};
  const caloriesData: { [date: string]: CaloriesData } = {};
  const otherData: { [date: string]: OtherMetrics } = {};
  
  Object.keys(monthData).forEach(date => {
    if (monthData[date].sleep) {
      sleepData[date] = monthData[date].sleep!;
    }
    if (monthData[date].diet) {
      dietData[date] = monthData[date].diet!;
    }
    if (monthData[date].calories) {
      caloriesData[date] = monthData[date].calories!;
    }
    if (monthData[date].other) {
      otherData[date] = monthData[date].other!;
    }
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-[100vw] mx-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                🏃‍♂️ David's Tracking System
              </h1>
              <p className="text-gray-600">
                Comprehensive health & fitness tracking with automated data sync
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleLoadSampleData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
              >
                📊 Load Sample Data
              </button>
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
              >
                🗑️ Clear All Data
              </button>
            </div>
          </div>
        </header>

        {/* Fitbit Sync Panel */}
        <div className="mb-6">
          <FitbitSyncPanel onSyncComplete={refreshData} />
        </div>

        <MonthNavigator onMonthChange={handleMonthChange} />

        <SleepTrackingSection
          year={currentDate.year}
          month={currentDate.month}
          sleepData={sleepData}
          onCellClick={handleSleepCellClick}
        />

        <DietTrackingSection
          year={currentDate.year}
          month={currentDate.month}
          dietData={dietData}
          caloriesData={caloriesData}
          onCellClick={handleDietCellClick}
        />

        <OtherMetricsSection
          year={currentDate.year}
          month={currentDate.month}
          otherData={otherData}
          onCellClick={handleOtherCellClick}
        />

        {/* Sleep Data Entry Modal */}
        <Modal
          isOpen={modalType === 'sleep'}
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

        {/* Diet Data Entry Modal */}
        <Modal
          isOpen={modalType === 'diet'}
          onClose={handleCloseModal}
          title="🍎 Edit Diet & Calories Data"
        >
          <DietDataForm
            date={selectedDate}
            initialDietData={dietData[selectedDate]}
            initialCaloriesData={caloriesData[selectedDate]}
            onSave={handleSaveDietData}
            onCancel={handleCloseModal}
          />
        </Modal>

        {/* Other Metrics Entry Modal */}
        <Modal
          isOpen={modalType === 'other'}
          onClose={handleCloseModal}
          title="📈 Edit Other Metrics"
        >
          <OtherMetricsForm
            date={selectedDate}
            initialData={otherData[selectedDate]}
            onSave={handleSaveOtherMetrics}
            onCancel={handleCloseModal}
          />
        </Modal>
      </div>
    </div>
  );
}

export default App;
