import { DietData, CaloriesData } from '../types/tracking';
import { getDatesInMonth, formatDateDisplay, getDayOfWeek } from '../utils/dateUtils';

interface DietTrackingSectionProps {
  year: number;
  month: number;
  dietData: { [date: string]: DietData };
  caloriesData: { [date: string]: CaloriesData };
  onCellClick: (date: string, section: 'diet' | 'calories') => void;
}

const DietTrackingSection = ({ 
  year, 
  month, 
  dietData, 
  caloriesData, 
  onCellClick 
}: DietTrackingSectionProps) => {
  const dates = getDatesInMonth(year, month);

  const dietMetrics: { label: string; key: keyof DietData; format?: (val: any) => string }[] = [
    { label: 'Calories Consumed', key: 'caloriesConsumed', format: (val) => val?.toString() || '' },
    { label: 'Protein', key: 'protein', format: (val) => val?.toString() || '' },
    { label: 'Fat', key: 'fat', format: (val) => val?.toString() || '' },
    { label: 'Carbs', key: 'carbs', format: (val) => val?.toString() || '' },
    { label: 'Sugar', key: 'sugar', format: (val) => val?.toString() || '' },
  ];

  const caloriesMetrics: { label: string; key: keyof CaloriesData; format?: (val: any) => string }[] = [
    { label: 'Calories Burned Total', key: 'caloriesBurnedTotal', format: (val) => val?.toString() || '' },
    { label: 'Calories Burned Active', key: 'caloriesBurnedActive', format: (val) => val?.toString() || '' },
    { label: 'Calories Burned BMR', key: 'caloriesBurnedBMR', format: (val) => val?.toString() || '' },
    { label: 'Calories Burned (Unregistered)', key: 'caloriesBurnedUnregistered', format: (val) => val?.toString() || '' },
    { label: 'Calories Deficit (Estimation)', key: 'caloriesDeficit', format: (val) => val?.toString() || '' },
  ];

  return (
    <div className="bg-orange-50 rounded-lg p-4 mb-6">
      <h3 className="text-xl font-bold text-orange-900 mb-4">🍎 Diet</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm">
          <thead>
            <tr className="bg-orange-600 text-white">
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold sticky left-0 bg-orange-600 z-10 min-w-[220px]">
                Metric
              </th>
              {dates.map((date) => (
                <th key={date} className="border border-gray-300 px-2 py-2 text-center min-w-[80px]">
                  <div className="text-sm font-semibold">{formatDateDisplay(date)}</div>
                  <div className="text-xs font-normal opacity-80">{getDayOfWeek(date)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dietMetrics.map((metric) => (
              <tr key={metric.key} className="hover:bg-orange-50 transition">
                <td className="border border-gray-300 px-3 py-2 font-medium bg-orange-100 sticky left-0 z-10">
                  {metric.label}
                </td>
                {dates.map((date) => {
                  const data = dietData[date];
                  const value = data?.[metric.key];
                  const displayValue = metric.format && value !== undefined
                    ? metric.format(value)
                    : value || '';

                  return (
                    <td
                      key={`${date}-${metric.key}`}
                      className="border border-gray-300 px-2 py-2 text-center cursor-pointer hover:bg-orange-100 transition"
                      onClick={() => onCellClick(date, 'diet')}
                    >
                      <span className={displayValue ? 'text-gray-800' : 'text-gray-300'}>
                        {displayValue || '—'}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
            
            {/* Empty row separator */}
            <tr className="bg-gray-100">
              <td colSpan={dates.length + 1} className="border border-gray-300 py-1"></td>
            </tr>

            {/* Calories Burned Section */}
            {caloriesMetrics.map((metric) => (
              <tr key={metric.key} className="hover:bg-orange-50 transition">
                <td className="border border-gray-300 px-3 py-2 font-medium bg-orange-100 sticky left-0 z-10">
                  {metric.label}
                </td>
                {dates.map((date) => {
                  const data = caloriesData[date];
                  const value = data?.[metric.key];
                  const displayValue = metric.format && value !== undefined
                    ? metric.format(value)
                    : value || '';

                  // Highlight deficit in red if negative, green if positive
                  const isDeficit = metric.key === 'caloriesDeficit';
                  const deficitColor = value && isDeficit
                    ? (value > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold')
                    : '';

                  return (
                    <td
                      key={`${date}-${metric.key}`}
                      className="border border-gray-300 px-2 py-2 text-center cursor-pointer hover:bg-orange-100 transition"
                      onClick={() => onCellClick(date, 'calories')}
                    >
                      <span className={displayValue ? `text-gray-800 ${deficitColor}` : 'text-gray-300'}>
                        {displayValue || '—'}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DietTrackingSection;
