import { DailyTracking, SleepData, DietData, CaloriesData, OtherMetrics } from '../types/tracking';
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
 * Generate realistic sample diet data
 */
const generateSampleDietData = (): DietData => {
  const caloriesConsumed = Math.round(2000 + Math.random() * 800); // 2000-2800
  const protein = Math.round(120 + Math.random() * 60); // 120-180g
  const fat = Math.round(60 + Math.random() * 40); // 60-100g
  const carbs = Math.round(200 + Math.random() * 150); // 200-350g
  const sugar = Math.round(30 + Math.random() * 70); // 30-100g
  
  return {
    caloriesConsumed,
    protein,
    fat,
    carbs,
    sugar
  };
};

/**
 * Generate realistic sample calories data
 */
const generateSampleCaloriesData = (caloriesConsumed: number): CaloriesData => {
  const caloriesBurnedBMR = Math.round(1700 + Math.random() * 300); // 1700-2000
  const caloriesBurnedActive = Math.round(400 + Math.random() * 600); // 400-1000
  const caloriesBurnedUnregistered = Math.round(0 + Math.random() * 300); // 0-300
  const caloriesBurnedTotal = caloriesBurnedBMR + caloriesBurnedActive + caloriesBurnedUnregistered;
  const caloriesDeficit = caloriesBurnedTotal - caloriesConsumed;
  
  return {
    caloriesBurnedTotal,
    caloriesBurnedActive,
    caloriesBurnedBMR,
    caloriesBurnedUnregistered,
    caloriesDeficit
  };
};

/**
 * Generate realistic sample other metrics
 */
const generateSampleOtherMetrics = (): OtherMetrics => {
  const weightMorning = 75 + (Math.random() * 3 - 1.5); // 73.5-76.5kg with variation
  const restingHR = Math.round(60 + Math.random() * 10); // 60-70 bpm
  const cardioLoad = Math.round(80 + Math.random() * 120); // 80-200
  const unregisteredCardioLoad = Math.round(0 + Math.random() * 100); // 0-100
  const cardioLoadTotal = cardioLoad + unregisteredCardioLoad;
  
  return {
    weightMorning: parseFloat(weightMorning.toFixed(1)),
    restingHR,
    cardioLoadTotal,
    cardioLoad,
    unregisteredCardioLoad
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
    const dietData = generateSampleDietData();
    
    sampleData[dateString] = {
      date: dateString,
      sleep: generateSampleSleepData(),
      diet: dietData,
      calories: generateSampleCaloriesData(dietData.caloriesConsumed),
      other: generateSampleOtherMetrics()
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
