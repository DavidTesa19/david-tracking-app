import { DailyTracking, MonthlyTracking } from '../types/tracking';

const STORAGE_KEY = 'david-tracking-data';

/**
 * Save tracking data to localStorage
 */
export const saveTrackingData = (data: MonthlyTracking): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving tracking data:', error);
  }
};

/**
 * Load all tracking data from localStorage
 */
export const loadTrackingData = (): MonthlyTracking => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading tracking data:', error);
    return {};
  }
};

/**
 * Get tracking data for a specific date
 */
export const getDataForDate = (date: string): DailyTracking | null => {
  const allData = loadTrackingData();
  return allData[date] || null;
};

/**
 * Update tracking data for a specific date
 */
export const updateDataForDate = (date: string, data: Partial<DailyTracking>): void => {
  const allData = loadTrackingData();
  
  if (!allData[date]) {
    allData[date] = { date };
  }
  
  allData[date] = {
    ...allData[date],
    ...data
  };
  
  saveTrackingData(allData);
};

/**
 * Get data for a specific month
 */
export const getMonthData = (year: number, month: number): MonthlyTracking => {
  const allData = loadTrackingData();
  const monthData: MonthlyTracking = {};
  
  // Filter data for the specific month
  Object.keys(allData).forEach(dateKey => {
    const date = new Date(dateKey);
    if (date.getFullYear() === year && date.getMonth() === month) {
      monthData[dateKey] = allData[dateKey];
    }
  });
  
  return monthData;
};

/**
 * Clear all tracking data (use with caution!)
 */
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
