import { useState } from 'react';
import { DietData, CaloriesData } from '../types/tracking';

interface DietDataFormProps {
  date: string;
  initialDietData?: DietData;
  initialCaloriesData?: CaloriesData;
  onSave: (dietData: DietData, caloriesData: CaloriesData) => void;
  onCancel: () => void;
}

const DietDataForm = ({ 
  date, 
  initialDietData, 
  initialCaloriesData, 
  onSave, 
  onCancel 
}: DietDataFormProps) => {
  const [dietData, setDietData] = useState<DietData>({
    caloriesConsumed: initialDietData?.caloriesConsumed || 0,
    protein: initialDietData?.protein || 0,
    fat: initialDietData?.fat || 0,
    carbs: initialDietData?.carbs || 0,
    sugar: initialDietData?.sugar || 0,
  });

  const [caloriesData, setCaloriesData] = useState<CaloriesData>({
    caloriesBurnedTotal: initialCaloriesData?.caloriesBurnedTotal || 0,
    caloriesBurnedActive: initialCaloriesData?.caloriesBurnedActive || 0,
    caloriesBurnedBMR: initialCaloriesData?.caloriesBurnedBMR || 0,
    caloriesBurnedUnregistered: initialCaloriesData?.caloriesBurnedUnregistered || 0,
    caloriesDeficit: 0, // Will be calculated
  });

  const handleDietChange = (field: keyof DietData, value: number) => {
    setDietData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCaloriesChange = (field: keyof CaloriesData, value: number) => {
    setCaloriesData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total calories burned
    const total = caloriesData.caloriesBurnedActive + 
                  caloriesData.caloriesBurnedBMR + 
                  caloriesData.caloriesBurnedUnregistered;
    
    // Calculate deficit (positive = deficit, negative = surplus)
    const deficit = total - dietData.caloriesConsumed;
    
    const finalCaloriesData = {
      ...caloriesData,
      caloriesBurnedTotal: total,
      caloriesDeficit: deficit
    };
    
    onSave(dietData, finalCaloriesData);
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

  // Calculate deficit in real-time for display
  const totalBurned = caloriesData.caloriesBurnedActive + 
                      caloriesData.caloriesBurnedBMR + 
                      caloriesData.caloriesBurnedUnregistered;
  const currentDeficit = totalBurned - dietData.caloriesConsumed;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-orange-50 p-3 rounded-lg">
        <p className="text-sm text-orange-800 font-medium">
          📅 Editing diet data for: <span className="font-bold">{formatDateDisplay(date)}</span>
        </p>
      </div>

      {/* Diet - Nutrition Consumed */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">🍎 Nutrition Consumed</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calories Consumed
            </label>
            <input
              type="number"
              value={dietData.caloriesConsumed || ''}
              onChange={(e) => handleDietChange('caloriesConsumed', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., 2500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              value={dietData.protein || ''}
              onChange={(e) => handleDietChange('protein', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., 150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fat (g)
            </label>
            <input
              type="number"
              value={dietData.fat || ''}
              onChange={(e) => handleDietChange('fat', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., 80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carbs (g)
            </label>
            <input
              type="number"
              value={dietData.carbs || ''}
              onChange={(e) => handleDietChange('carbs', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., 250"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sugar (g)
            </label>
            <input
              type="number"
              value={dietData.sugar || ''}
              onChange={(e) => handleDietChange('sugar', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., 50"
            />
          </div>
        </div>
      </div>

      {/* Calories Burned */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">🔥 Calories Burned</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Active Calories Burned
            </label>
            <input
              type="number"
              value={caloriesData.caloriesBurnedActive || ''}
              onChange={(e) => handleCaloriesChange('caloriesBurnedActive', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., 800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BMR (Base Metabolic Rate)
            </label>
            <input
              type="number"
              value={caloriesData.caloriesBurnedBMR || ''}
              onChange={(e) => handleCaloriesChange('caloriesBurnedBMR', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., 1800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unregistered Calories Burned
            </label>
            <input
              type="number"
              value={caloriesData.caloriesBurnedUnregistered || ''}
              onChange={(e) => handleCaloriesChange('caloriesBurnedUnregistered', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., 200"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Burned (Auto-calculated)</div>
            <div className="text-2xl font-bold text-gray-800">{totalBurned}</div>
          </div>
        </div>

        {/* Deficit/Surplus Display */}
        <div className={`mt-4 p-4 rounded-lg ${currentDeficit > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Calorie {currentDeficit > 0 ? 'Deficit' : 'Surplus'}
            </div>
            <div className={`text-3xl font-bold ${currentDeficit > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {currentDeficit > 0 ? '+' : ''}{currentDeficit}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentDeficit > 0 ? 'Burning more than consuming' : 'Consuming more than burning'}
            </div>
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
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
        >
          💾 Save Diet Data
        </button>
      </div>
    </form>
  );
};

export default DietDataForm;
