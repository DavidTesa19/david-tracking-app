// Sleep Tracking Data (from Fitbit)
export interface SleepData {
  timeInBed: number; // hours
  timeFullyAsleep: number; // hours
  sleepScore: number; // 0-100
  avgSleepHR: number; // beats per minute
  sleepFrom: string; // time format "HH:mm"
  sleepTo: string; // time format "HH:mm"
  napFrom?: string; // optional nap time
  napTo?: string; // optional nap time
  napFullyAsleep?: number; // optional nap duration in hours
}

// Diet Data (from MyFitnessPal)
export interface DietData {
  caloriesConsumed: number;
  protein: number; // grams
  fat: number; // grams
  carbs: number; // grams
  sugar: number; // grams
}

// Calories & Activity Data (from Fitbit)
export interface CaloriesData {
  caloriesBurnedTotal: number;
  caloriesBurnedActive: number;
  caloriesBurnedBMR: number;
  caloriesBurnedUnregistered: number;
  caloriesDeficit: number; // calculated
}

// Other Metrics
export interface OtherMetrics {
  weightMorning: number; // kg or lbs
  restingHR: number; // beats per minute
  cardioLoadTotal: number;
  cardioLoad: number;
  unregisteredCardioLoad: number;
}

// Complete daily tracking data
export interface DailyTracking {
  date: string; // ISO format: YYYY-MM-DD
  sleep?: SleepData;
  diet?: DietData;
  calories?: CaloriesData;
  other?: OtherMetrics;
}

// Monthly tracking data (key = date string)
export interface MonthlyTracking {
  [date: string]: DailyTracking;
}

// Data source indicator
export type DataSource = 'fitbit' | 'myfitnesspal' | 'manual';

export interface DataEntry {
  value: number | string;
  source: DataSource;
  timestamp: string; // when data was added/synced
}
