import { FITBIT_CONFIG, STORAGE_KEYS } from '../config/api';
import { SleepData, CaloriesData, OtherMetrics } from '../types/tracking';

/**
 * Fitbit API Service
 * Handles authentication and data fetching from Fitbit API
 */

// Generate OAuth URL for user to authorize the app
export const getFitbitAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: FITBIT_CONFIG.CLIENT_ID,
    response_type: 'code',
    scope: FITBIT_CONFIG.SCOPE,
    redirect_uri: FITBIT_CONFIG.REDIRECT_URI,
  });

  return `${FITBIT_CONFIG.AUTH_URL}?${params.toString()}`;
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code: string): Promise<boolean> => {
  try {
    const credentials = btoa(`${FITBIT_CONFIG.CLIENT_ID}:${FITBIT_CONFIG.CLIENT_SECRET}`);
    
    const response = await fetch(FITBIT_CONFIG.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: FITBIT_CONFIG.CLIENT_ID,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: FITBIT_CONFIG.REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    
    // Store tokens
    localStorage.setItem(STORAGE_KEYS.FITBIT_ACCESS_TOKEN, data.access_token);
    localStorage.setItem(STORAGE_KEYS.FITBIT_REFRESH_TOKEN, data.refresh_token);
    localStorage.setItem(
      STORAGE_KEYS.FITBIT_TOKEN_EXPIRY,
      String(Date.now() + data.expires_in * 1000)
    );

    return true;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return false;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(STORAGE_KEYS.FITBIT_ACCESS_TOKEN);
  const expiry = localStorage.getItem(STORAGE_KEYS.FITBIT_TOKEN_EXPIRY);
  
  if (!token || !expiry) return false;
  
  // Check if token is expired
  return Date.now() < parseInt(expiry);
};

// Refresh access token
const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.FITBIT_REFRESH_TOKEN);
    if (!refreshToken) return false;

    const credentials = btoa(`${FITBIT_CONFIG.CLIENT_ID}:${FITBIT_CONFIG.CLIENT_SECRET}`);
    
    const response = await fetch(FITBIT_CONFIG.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    
    localStorage.setItem(STORAGE_KEYS.FITBIT_ACCESS_TOKEN, data.access_token);
    localStorage.setItem(STORAGE_KEYS.FITBIT_REFRESH_TOKEN, data.refresh_token);
    localStorage.setItem(
      STORAGE_KEYS.FITBIT_TOKEN_EXPIRY,
      String(Date.now() + data.expires_in * 1000)
    );

    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

// Make authenticated API request
const fetchFitbitData = async (endpoint: string): Promise<any> => {
  // Check if token needs refresh
  if (!isAuthenticated()) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      throw new Error('Authentication required');
    }
  }

  const token = localStorage.getItem(STORAGE_KEYS.FITBIT_ACCESS_TOKEN);
  
  const response = await fetch(`${FITBIT_CONFIG.API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Fitbit API error: ${response.statusText}`);
  }

  return response.json();
};

// Fetch sleep data for a specific date
export const fetchSleepData = async (date: string): Promise<SleepData | null> => {
  try {
    const data = await fetchFitbitData(`/sleep/date/${date}.json`);
    
    if (!data.sleep || data.sleep.length === 0) return null;

    const mainSleep = data.sleep.find((s: any) => s.isMainSleep) || data.sleep[0];
    
    // Convert Fitbit data to our format
    const sleepData: SleepData = {
      timeInBed: mainSleep.timeInBed / 60, // Convert minutes to hours
      timeFullyAsleep: mainSleep.minutesAsleep / 60, // Convert to hours
      sleepScore: data.summary?.score || 0,
      avgSleepHR: mainSleep.averageHeartRate || 0,
      sleepFrom: mainSleep.startTime.split('T')[1].substring(0, 5), // Extract time
      sleepTo: mainSleep.endTime.split('T')[1].substring(0, 5),
    };

    // Check for naps
    const naps = data.sleep.filter((s: any) => !s.isMainSleep);
    if (naps.length > 0) {
      const nap = naps[0];
      sleepData.napFrom = nap.startTime.split('T')[1].substring(0, 5);
      sleepData.napTo = nap.endTime.split('T')[1].substring(0, 5);
      sleepData.napFullyAsleep = nap.minutesAsleep / 60;
    }

    return sleepData;
  } catch (error) {
    console.error('Error fetching sleep data:', error);
    return null;
  }
};

// Fetch activity/calories data
export const fetchCaloriesData = async (date: string): Promise<CaloriesData | null> => {
  try {
    const data = await fetchFitbitData(`/activities/date/${date}.json`);
    
    const caloriesData: CaloriesData = {
      caloriesBurnedTotal: data.summary?.caloriesOut || 0,
      caloriesBurnedActive: data.summary?.activityCalories || 0,
      caloriesBurnedBMR: data.summary?.caloriesBMR || 0,
      caloriesBurnedUnregistered: 0, // Will calculate
      caloriesDeficit: 0, // Will calculate after getting food data
    };

    // Calculate unregistered
    caloriesData.caloriesBurnedUnregistered = 
      caloriesData.caloriesBurnedTotal - 
      caloriesData.caloriesBurnedActive - 
      caloriesData.caloriesBurnedBMR;

    return caloriesData;
  } catch (error) {
    console.error('Error fetching calories data:', error);
    return null;
  }
};

// Fetch weight and heart rate data
export const fetchOtherMetrics = async (date: string): Promise<Partial<OtherMetrics>> => {
  try {
    const metrics: Partial<OtherMetrics> = {};

    // Fetch weight
    try {
      const weightData = await fetchFitbitData(`/body/log/weight/date/${date}.json`);
      if (weightData.weight && weightData.weight.length > 0) {
        metrics.weightMorning = weightData.weight[0].weight;
      }
    } catch (e) {
      console.warn('No weight data for', date);
    }

    // Fetch resting heart rate
    try {
      const hrData = await fetchFitbitData(`/activities/heart/date/${date}/1d.json`);
      if (hrData['activities-heart'] && hrData['activities-heart'].length > 0) {
        const heartData = hrData['activities-heart'][0].value;
        metrics.restingHR = heartData.restingHeartRate || 0;
      }
    } catch (e) {
      console.warn('No heart rate data for', date);
    }

    // Fetch cardio load (using cardio fitness score as proxy)
    try {
      const activityData = await fetchFitbitData(`/activities/date/${date}.json`);
      // Fitbit doesn't have direct "cardio load" - we can use activity minutes or steps
      const activeMinutes = activityData.summary?.veryActiveMinutes || 0;
      const fairlyActiveMinutes = activityData.summary?.fairlyActiveMinutes || 0;
      
      // Approximate cardio load
      metrics.cardioLoad = Math.round((activeMinutes * 2 + fairlyActiveMinutes) * 1.5);
      metrics.unregisteredCardioLoad = 0;
      metrics.cardioLoadTotal = metrics.cardioLoad;
    } catch (e) {
      console.warn('No activity data for', date);
    }

    return metrics;
  } catch (error) {
    console.error('Error fetching other metrics:', error);
    return {};
  }
};

// Disconnect Fitbit (logout)
export const disconnectFitbit = (): void => {
  localStorage.removeItem(STORAGE_KEYS.FITBIT_ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.FITBIT_REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.FITBIT_TOKEN_EXPIRY);
};
