/**
 * API Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. FITBIT API SETUP:
 *    - Go to: https://dev.fitbit.com/apps
 *    - Click "Register a New App"
 *    - Fill in:
 *      * Application Name: David Tracking App
 *      * Description: Personal health tracking dashboard
 *      * Application Website: http://localhost:5173
 *      * OAuth 2.0 Application Type: Personal
 *      * Callback URL: http://localhost:5173/callback
 *      * Default Access Type: Read-Only
 *    - Copy the Client ID and Client Secret
 * 
 * 2. MYFITNESSPAL:
 *    - Note: MyFitnessPal doesn't have a public API anymore
 *    - Alternative options:
 *      a) Use unofficial API/scraping (not recommended)
 *      b) Manual CSV export from MyFitnessPal
 *      c) Use alternative: Nutritionix API or USDA FoodData Central
 * 
 * 3. CREATE .env FILE:
 *    - Create a file named `.env` in the root directory
 *    - Add your credentials (NEVER commit this file!)
 */

// Fitbit API Configuration
export const FITBIT_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_FITBIT_CLIENT_ID || '',
  CLIENT_SECRET: import.meta.env.VITE_FITBIT_CLIENT_SECRET || '',
  REDIRECT_URI: import.meta.env.VITE_FITBIT_REDIRECT_URI || 'http://localhost:5173/callback',
  AUTH_URL: 'https://www.fitbit.com/oauth2/authorize',
  TOKEN_URL: 'https://api.fitbit.com/oauth2/token',
  API_BASE_URL: 'https://api.fitbit.com/1/user/-',
  SCOPE: 'activity heartrate sleep weight',
};

// MyFitnessPal - Alternative: Nutritionix API (free tier available)
export const NUTRITION_CONFIG = {
  API_KEY: import.meta.env.VITE_NUTRITIONIX_API_KEY || '',
  APP_ID: import.meta.env.VITE_NUTRITIONIX_APP_ID || '',
  API_BASE_URL: 'https://trackapi.nutritionix.com/v2',
};

// Local storage keys
export const STORAGE_KEYS = {
  FITBIT_ACCESS_TOKEN: 'fitbit_access_token',
  FITBIT_REFRESH_TOKEN: 'fitbit_refresh_token',
  FITBIT_TOKEN_EXPIRY: 'fitbit_token_expiry',
  LAST_SYNC_DATE: 'last_sync_date',
};
