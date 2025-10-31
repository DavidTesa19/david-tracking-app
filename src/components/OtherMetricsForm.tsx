import { useState } from 'react';
import { OtherMetrics } from '../types/tracking';

interface OtherMetricsFormProps {
  date: string;
  initialData?: OtherMetrics;
  onSave: (data: OtherMetrics) => void;
  onCancel: () => void;
}

const OtherMetricsForm = ({ date, initialData, onSave, onCancel }: OtherMetricsFormProps) => {
  const [formData, setFormData] = useState<OtherMetrics>({
    weightMorning: initialData?.weightMorning || 0,
    restingHR: initialData?.restingHR || 0,
    cardioLoadTotal: initialData?.cardioLoadTotal || 0,
    cardioLoad: initialData?.cardioLoad || 0,
    unregisteredCardioLoad: initialData?.unregisteredCardioLoad || 0,
  });

  const handleChange = (field: keyof OtherMetrics, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total cardio load
    const total = formData.cardioLoad + formData.unregisteredCardioLoad;
    
    onSave({
      ...formData,
      cardioLoadTotal: total
    });
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

  const totalCardioLoad = formData.cardioLoad + formData.unregisteredCardioLoad;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-purple-50 p-3 rounded-lg">
        <p className="text-sm text-purple-800 font-medium">
          📅 Editing other metrics for: <span className="font-bold">{formatDateDisplay(date)}</span>
        </p>
      </div>

      {/* Weight & Heart Rate */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">⚖️ Weight & Heart Rate</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (Morning) - kg
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weightMorning || ''}
              onChange={(e) => handleChange('weightMorning', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., 75.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resting Heart Rate (bpm) ❤️
            </label>
            <input
              type="number"
              value={formData.restingHR || ''}
              onChange={(e) => handleChange('restingHR', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., 62"
            />
          </div>
        </div>
      </div>

      {/* Cardio Load */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">💪 Cardio Load</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardio Load (Registered)
            </label>
            <input
              type="number"
              value={formData.cardioLoad || ''}
              onChange={(e) => handleChange('cardioLoad', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., 150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unregistered Cardio Load
            </label>
            <input
              type="number"
              value={formData.unregisteredCardioLoad || ''}
              onChange={(e) => handleChange('unregisteredCardioLoad', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., 50"
            />
          </div>

          <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Cardio Load (Auto-calculated)</div>
            <div className="text-2xl font-bold text-gray-800">{totalCardioLoad}</div>
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
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
        >
          💾 Save Other Metrics
        </button>
      </div>
    </form>
  );
};

export default OtherMetricsForm;
