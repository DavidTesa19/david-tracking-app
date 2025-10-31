import { useState } from 'react';
import { SleepData } from '../types/tracking';

interface SleepDataFormProps {
  date: string;
  initialData?: SleepData;
  onSave: (data: SleepData) => void;
  onCancel: () => void;
}

const SleepDataForm = ({ date, initialData, onSave, onCancel }: SleepDataFormProps) => {
  const [formData, setFormData] = useState<SleepData>({
    timeInBed: initialData?.timeInBed || 0,
    timeFullyAsleep: initialData?.timeFullyAsleep || 0,
    sleepScore: initialData?.sleepScore || 0,
    avgSleepHR: initialData?.avgSleepHR || 0,
    sleepFrom: initialData?.sleepFrom || '',
    sleepTo: initialData?.sleepTo || '',
    napFrom: initialData?.napFrom || '',
    napTo: initialData?.napTo || '',
    napFullyAsleep: initialData?.napFullyAsleep || 0,
  });

  const handleChange = (field: keyof SleepData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800 font-medium">
          📅 Editing sleep data for: <span className="font-bold">{formatDateDisplay(date)}</span>
        </p>
      </div>

      {/* Sleep Times */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sleep From ⏰
          </label>
          <input
            type="time"
            value={formData.sleepFrom}
            onChange={(e) => handleChange('sleepFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sleep To ⏰
          </label>
          <input
            type="time"
            value={formData.sleepTo}
            onChange={(e) => handleChange('sleepTo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Sleep Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time in Bed (hours) 🛏️
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.timeInBed || ''}
            onChange={(e) => handleChange('timeInBed', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 8.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Fully Asleep (hours) 😴
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.timeFullyAsleep || ''}
            onChange={(e) => handleChange('timeFullyAsleep', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 7.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sleep Score (0-100) ⭐
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.sleepScore || ''}
            onChange={(e) => handleChange('sleepScore', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 85"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Avg Sleep HR (bpm) ❤️
          </label>
          <input
            type="number"
            value={formData.avgSleepHR || ''}
            onChange={(e) => handleChange('avgSleepHR', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 55"
          />
        </div>
      </div>

      {/* Nap Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">💤 Nap Data (Optional)</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nap From
            </label>
            <input
              type="time"
              value={formData.napFrom}
              onChange={(e) => handleChange('napFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nap To
            </label>
            <input
              type="time"
              value={formData.napTo}
              onChange={(e) => handleChange('napTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nap Fully Asleep (hrs)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.napFullyAsleep || ''}
              onChange={(e) => handleChange('napFullyAsleep', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 1.5"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          💾 Save Sleep Data
        </button>
      </div>
    </form>
  );
};

export default SleepDataForm;
