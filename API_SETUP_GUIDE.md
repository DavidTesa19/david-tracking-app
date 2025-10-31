# 🔗 API Integration Setup Guide

This guide will help you connect Fitbit to automatically sync your health data.

## 📋 Prerequisites

- Fitbit account
- Node.js installed
- This tracking app running locally

---

## 🎯 Step 1: Register Fitbit App

1. **Go to Fitbit Developer Portal**
   - Visit: https://dev.fitbit.com/apps
   - Log in with your Fitbit account

2. **Click "Register a New App"**

3. **Fill in the Application Details:**

   ```
   Application Name: David Tracking App
   Description: Personal health and fitness tracking dashboard
   Application Website: http://localhost:5173
   Organization: (Your name)
   Organization Website: http://localhost:5173
   Terms of Service URL: http://localhost:5173
   Privacy Policy URL: http://localhost:5173
   ```

4. **OAuth 2.0 Settings:**

   ```
   OAuth 2.0 Application Type: Personal
   Callback URL: http://localhost:5173/callback
   Default Access Type: Read-Only
   ```

5. **Click "Save"**

6. **Copy Your Credentials:**
   - You'll see **OAuth 2.0 Client ID** and **Client Secret**
   - Keep these safe - you'll need them next!

---

## 🔐 Step 2: Configure Environment Variables

1. **Create `.env` file** in the project root:

   ```bash
   # In your project folder
   copy .env.example .env
   ```

2. **Edit `.env` file** and add your credentials:

   ```env
   VITE_FITBIT_CLIENT_ID=YOUR_CLIENT_ID_HERE
   VITE_FITBIT_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
   VITE_FITBIT_REDIRECT_URI=http://localhost:5173/callback
   ```

3. **Save the file**

4. **Restart your dev server:**
   ```bash
   npm run dev
   ```

---

## ✅ Step 3: Test the Connection

1. **Open the app** in your browser: `http://localhost:5173`

2. **Look for the "Connect Fitbit" panel** (blue/purple gradient box)

3. **Click "Connect Fitbit"**
   - You'll be redirected to Fitbit's authorization page
   - Log in if needed
   - Click "Allow" to grant permissions

4. **You'll be redirected back** to your app
   - You should see "Success!" message
   - The panel will now show "Fitbit Connected" with a green dot

5. **Click "Sync Today"** to test
   - Your Fitbit data should appear in the tables!

---

## 🔄 How to Use

### Manual Sync:
- **Sync Today**: Get today's data
- **Last 7 Days**: Sync the past week
- **Last 30 Days**: Sync the past month

### What Gets Synced:

**From Fitbit:**
- ✅ Sleep data (duration, score, heart rate)
- ✅ Calories burned (active, BMR, total)
- ✅ Weight (if logged in Fitbit app)
- ✅ Resting heart rate
- ✅ Activity/Cardio load

**Not Yet Available:**
- ❌ Diet/Nutrition (MyFitnessPal API is not public)
- 💡 You can still enter this manually or we can add CSV import

---

## ⚠️ Troubleshooting

### "Authentication Required" Error:
- Your token may have expired
- Click "Disconnect" then "Connect Fitbit" again

### "Sync Failed" Error:
- Check your internet connection
- Verify your `.env` credentials are correct
- Make sure you have data in Fitbit for those dates

### No Data Appearing:
- Ensure you have data logged in your Fitbit app for those dates
- Try syncing just one day first (Sync Today)
- Check browser console for error messages (F12)

### Rate Limiting:
- Fitbit API has rate limits (150 requests/hour)
- If syncing 30 days fails, try 7 days first
- Wait an hour if you hit the limit

---

## 📊 MyFitnessPal Alternative

Since MyFitnessPal doesn't have a public API, here are your options:

### Option 1: Manual Entry (Current)
- Click any cell in the Diet section
- Enter your nutrition data manually

### Option 2: CSV Import (Future Feature)
- Export data from MyFitnessPal as CSV
- Import it into the app
- We can build this if you want!

### Option 3: Nutritionix API
- Free API for nutrition data
- Get API key from: https://www.nutritionix.com/business/api
- Add to `.env`:
  ```env
  VITE_NUTRITIONIX_APP_ID=your_app_id
  VITE_NUTRITIONIX_API_KEY=your_api_key
  ```

---

## 🔒 Security Notes

- ✅ All API credentials are stored in `.env` (NOT committed to git)
- ✅ OAuth tokens are stored securely in browser localStorage
- ✅ Tokens auto-refresh when needed
- ✅ Read-only access to your Fitbit data
- ⚠️ Never share your `.env` file or commit it to git!

---

## 🎉 Success!

Once connected, your Fitbit data will automatically sync! You can:
- ✅ View all your health metrics in one place
- ✅ Track trends over time
- ✅ Combine Fitbit data with manual entries
- ✅ Export data for analysis

**Questions?** Check the console logs (F12) for detailed error messages.

---

## 📝 Quick Reference

**Fitbit Developer Portal:** https://dev.fitbit.com/apps  
**Fitbit API Docs:** https://dev.fitbit.com/build/reference/  
**Callback URL:** http://localhost:5173/callback  
**App URL:** http://localhost:5173  

**Need Help?** Open an issue or check the browser console for errors.
