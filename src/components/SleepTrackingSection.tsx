import { SleepData } from '../types/tracking';
import { getDatesInMonth, formatDateDisplay, getDayOfWeek } from '../utils/dateUtils';

interface SleepTrackingSectionProps {
  year: number;
  month: number;
  sleepData: { [date: string]: SleepData };
  onCellClick: (date: string, metric: keyof SleepData) => void;
}

const SleepTrackingSection = ({ year, month, sleepData, onCellClick }: SleepTrackingSectionProps) => {
  const dates = getDatesInMonth(year, month);

  const metrics: { label: string; key: keyof SleepData; format?: (val: any) => string }[] = [
    { label: 'Time in Bed', key: 'timeInBed', format: (val) => val?.toFixed(2) || '' },
    { label: 'Time Fully Asleep', key: 'timeFullyAsleep', format: (val) => val?.toFixed(2) || '' },
    { label: 'Sleep Score', key: 'sleepScore', format: (val) => val?.toString() || '' },
    { label: 'Avg Sleep HR', key: 'avgSleepHR', format: (val) => val?.toString() || '' },
    { label: 'From', key: 'sleepFrom' },
    { label: 'To', key: 'sleepTo' },
    { label: 'Nap From', key: 'napFrom' },
    { label: 'Nap To', key: 'napTo' },
    { label: 'Nap Fully Asleep', key: 'napFullyAsleep', format: (val) => val?.toFixed(2) || '' },
  ];

  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-6">
      <h3 className="text-xl font-bold text-blue-900 mb-4">📊 Tracking Data - Sleep</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold sticky left-0 bg-blue-600 z-10 min-w-[180px]">
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
            {metrics.map((metric) => (
              <tr key={metric.key} className="hover:bg-blue-50 transition">
                <td className="border border-gray-300 px-3 py-2 font-medium bg-blue-100 sticky left-0 z-10">
                  {metric.label}
                </td>
                {dates.map((date) => {
                  const data = sleepData[date];
                  const value = data?.[metric.key];
                  const displayValue = metric.format && value !== undefined
                    ? metric.format(value)
                    : value || '';

                  return (
                    <td
                      key={`${date}-${metric.key}`}
                      className="border border-gray-300 px-2 py-2 text-center cursor-pointer hover:bg-blue-100 transition"
                      onClick={() => onCellClick(date, metric.key)}
                    >
                      <span className={displayValue ? 'text-gray-800' : 'text-gray-300'}>
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

export default SleepTrackingSection;
