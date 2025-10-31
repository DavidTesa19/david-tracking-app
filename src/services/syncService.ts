import { fetchSleepData, fetchCaloriesData, fetchOtherMetrics } from './fitbitService';
import { updateDataForDate } from '../utils/storage';
import { STORAGE_KEYS } from '../config/api';

/**
 * Data Sync Service
 * Coordinates data fetching from multiple sources and updates local storage
 */

export interface SyncProgress {
  total: number;
  completed: number;
  current: string;
  errors: string[];
}

export type SyncCallback = (progress: SyncProgress) => void;

/**
 * Sync data for a date range
 */
export const syncDateRange = async (
  startDate: string,
  endDate: string,
  onProgress?: SyncCallback
): Promise<{ success: number; failed: number; errors: string[] }> => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];
  
  // Generate array of dates
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }

  const progress: SyncProgress = {
    total: dates.length,
    completed: 0,
    current: '',
    errors: [],
  };

  let successCount = 0;
  let failedCount = 0;

  for (const date of dates) {
    progress.current = date;
    onProgress?.(progress);

    try {
      await syncSingleDate(date);
      successCount++;
    } catch (error) {
      failedCount++;
      const errorMsg = `Failed to sync ${date}: ${error}`;
      progress.errors.push(errorMsg);
      console.error(errorMsg);
    }

    progress.completed++;
    onProgress?.(progress);
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Update last sync date
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC_DATE, endDate);

  return {
    success: successCount,
    failed: failedCount,
    errors: progress.errors,
  };
};

/**
 * Sync data for a single date
 */
export const syncSingleDate = async (date: string): Promise<void> => {
  try {
    // Fetch all data in parallel
    const [sleepData, caloriesData, otherMetrics] = await Promise.all([
      fetchSleepData(date),
      fetchCaloriesData(date),
      fetchOtherMetrics(date),
    ]);

    // Update local storage
    const updateData: any = {};
    
    if (sleepData) {
      updateData.sleep = sleepData;
    }
    
    if (caloriesData) {
      updateData.calories = caloriesData;
    }
    
    if (otherMetrics && Object.keys(otherMetrics).length > 0) {
      updateData.other = {
        weightMorning: otherMetrics.weightMorning || 0,
        restingHR: otherMetrics.restingHR || 0,
        cardioLoadTotal: otherMetrics.cardioLoadTotal || 0,
        cardioLoad: otherMetrics.cardioLoad || 0,
        unregisteredCardioLoad: otherMetrics.unregisteredCardioLoad || 0,
      };
    }

    if (Object.keys(updateData).length > 0) {
      updateDataForDate(date, updateData);
    }
  } catch (error) {
    throw new Error(`Failed to sync ${date}: ${error}`);
  }
};

/**
 * Sync today's data
 */
export const syncToday = async (): Promise<void> => {
  const today = new Date().toISOString().split('T')[0];
  await syncSingleDate(today);
};

/**
 * Sync last 7 days
 */
export const syncLastWeek = async (onProgress?: SyncCallback): Promise<any> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  
  return syncDateRange(
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0],
    onProgress
  );
};

/**
 * Sync last 30 days
 */
export const syncLastMonth = async (onProgress?: SyncCallback): Promise<any> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  return syncDateRange(
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0],
    onProgress
  );
};

/**
 * Get last sync date
 */
export const getLastSyncDate = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.LAST_SYNC_DATE);
};
