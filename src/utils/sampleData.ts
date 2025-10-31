import { DailyTracking, SleepData } from '../types/tracking';
import { saveTrackingData } from './storage';

/**
 * Generate realistic sample sleep data
 */
const generateSampleSleepData = (): SleepData => {
  // Randomize data to make it realistic
  const baseTimeInBed = 7.5 + (Math.random() * 2); // 7.5-9.5 hours
  const sleepEfficiency = 0.85 + (Math.random() * 0.1); // 85-95% efficiency
  const timeFullyAsleep = baseTimeInBed * sleepEfficiency;
  
  // Sleep score correlates with sleep duration and efficiency
  const sleepScore = Math.round(70 + (timeFullyAsleep / 9) * 30 + Math.random() * 10);
  
  // Avg HR during sleep
  const avgSleepHR = Math.round(52 + Math.random() * 8); // 52-60 bpm
  
  // Sleep times
  const bedtimeHour = 22 + Math.floor(Math.random() * 3); // 10 PM - 1 AM
  const bedtimeMinute = Math.floor(Math.random() * 60);
  const wakeHour = bedtimeHour + Math.floor(baseTimeInBed);
  const wakeMinute = bedtimeMinute + Math.round((baseTimeInBed % 1) * 60);
  
  const sleepFrom = `${String(bedtimeHour % 24).padStart(2, '0')}:${String(bedtimeMinute).padStart(2, '0')}`;
  const sleepTo = `${String(wakeHour % 24).padStart(2, '0')}:${String(wakeMinute % 60).padStart(2, '0')}`;
  
  // Some days have naps (30% chance)
  const hasNap = Math.random() > 0.7;
  const napData = hasNap ? {
    napFrom: '14:30',
    napTo: '15:45',
    napFullyAsleep: 1.0 + Math.random() * 0.5
  } : {};
  
  return {
    timeInBed: parseFloat(baseTimeInBed.toFixed(2)),
    timeFullyAsleep: parseFloat(timeFullyAsleep.toFixed(2)),
    sleepScore,
    avgSleepHR,
    sleepFrom,
    sleepTo,
    ...napData
  };
};

/**
 * Generate sample data for October 2025
 */
export const generateOctoberSampleData = (): void => {
  const sampleData: { [date: string]: DailyTracking } = {};
  
  // Generate data for first 20 days of October 2025
  for (let day = 1; day <= 20; day++) {
    const dateString = `2025-10-${String(day).padStart(2, '0')}`;
    
    sampleData[dateString] = {
      date: dateString,
      sleep: generateSampleSleepData()
    };
  }
  
  // Save to localStorage
  saveTrackingData(sampleData);
  
  console.log('✅ Sample data generated for October 1-20, 2025');
};

/**
 * Clear sample data (useful for testing)
 */
export const clearSampleData = (): void => {
  localStorage.removeItem('david-tracking-data');
  console.log('🗑️ Sample data cleared');
};
