import { useState, useEffect } from 'react';
import { 
  isAuthenticated, 
  getFitbitAuthUrl, 
  disconnectFitbit 
} from '../services/fitbitService';
import { 
  syncToday, 
  syncLastWeek, 
  syncLastMonth, 
  getLastSyncDate,
  SyncProgress 
} from '../services/syncService';

interface FitbitSyncPanelProps {
  onSyncComplete: () => void;
}

const FitbitSyncPanel = ({ onSyncComplete }: FitbitSyncPanelProps) => {
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    setConnected(isAuthenticated());
    setLastSync(getLastSyncDate());
  }, []);

  const handleConnect = () => {
    const authUrl = getFitbitAuthUrl();
    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    if (confirm('Are you sure you want to disconnect Fitbit?')) {
      disconnectFitbit();
      setConnected(false);
      setLastSync(null);
    }
  };

  const handleSyncToday = async () => {
    setSyncing(true);
    try {
      await syncToday();
      setLastSync(new Date().toISOString().split('T')[0]);
      onSyncComplete();
      alert('✅ Today\'s data synced successfully!');
    } catch (error) {
      alert(`❌ Sync failed: ${error}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncWeek = async () => {
    setSyncing(true);
    try {
      const result = await syncLastWeek((progress) => {
        setSyncProgress(progress);
      });
      setLastSync(new Date().toISOString().split('T')[0]);
      onSyncComplete();
      alert(`✅ Synced last 7 days!\nSuccess: ${result.success}, Failed: ${result.failed}`);
    } catch (error) {
      alert(`❌ Sync failed: ${error}`);
    } finally {
      setSyncing(false);
      setSyncProgress(null);
    }
  };

  const handleSyncMonth = async () => {
    setSyncing(true);
    try {
      const result = await syncLastMonth((progress) => {
        setSyncProgress(progress);
      });
      setLastSync(new Date().toISOString().split('T')[0]);
      onSyncComplete();
      alert(`✅ Synced last 30 days!\nSuccess: ${result.success}, Failed: ${result.failed}`);
    } catch (error) {
      alert(`❌ Sync failed: ${error}`);
    } finally {
      setSyncing(false);
      setSyncProgress(null);
    }
  };

  if (!connected) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">🔗 Connect Fitbit</h3>
            <p className="text-blue-100 mb-4">
              Automatically sync your sleep, activity, and health data
            </p>
            <ul className="text-sm text-blue-100 space-y-1 mb-4">
              <li>✓ Sleep tracking (time, score, heart rate)</li>
              <li>✓ Activity & calories burned</li>
              <li>✓ Weight & resting heart rate</li>
              <li>✓ Auto-sync daily</li>
            </ul>
          </div>
          <button
            onClick={handleConnect}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-bold text-lg shadow-lg"
          >
            Connect Fitbit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-green-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-xl font-bold text-gray-800">Fitbit Connected</h3>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm font-medium"
        >
          Disconnect
        </button>
      </div>

      {lastSync && (
        <p className="text-sm text-gray-600 mb-4">
          Last synced: {new Date(lastSync).toLocaleDateString()}
        </p>
      )}

      {/* Sync Progress */}
      {syncing && syncProgress && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span>Syncing {syncProgress.current}...</span>
            <span>{syncProgress.completed} / {syncProgress.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(syncProgress.completed / syncProgress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Sync Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={handleSyncToday}
          disabled={syncing}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncing ? '⏳' : '🔄'} Sync Today
        </button>
        <button
          onClick={handleSyncWeek}
          disabled={syncing}
          className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncing ? '⏳' : '📅'} Last 7 Days
        </button>
        <button
          onClick={handleSyncMonth}
          disabled={syncing}
          className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncing ? '⏳' : '📆'} Last 30 Days
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        💡 Tip: Sync regularly to keep your data up to date
      </p>
    </div>
  );
};

export default FitbitSyncPanel;
