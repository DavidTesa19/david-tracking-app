import { OtherMetrics } from '../types/tracking';
import { getDatesInMonth, formatDateDisplay, getDayOfWeek } from '../utils/dateUtils';

interface OtherMetricsSectionProps {
  year: number;
  month: number;
  otherData: { [date: string]: OtherMetrics };
  onCellClick: (date: string) => void;
}

const OtherMetricsSection = ({ year, month, otherData, onCellClick }: OtherMetricsSectionProps) => {
  const dates = getDatesInMonth(year, month);

  const metrics: { label: string; key: keyof OtherMetrics; format?: (val: any) => string }[] = [
    { label: 'Weight (Morning)', key: 'weightMorning', format: (val) => val?.toFixed(1) || '' },
    { label: 'Resting HR', key: 'restingHR', format: (val) => val?.toString() || '' },
    { label: 'Cardio Load Total', key: 'cardioLoadTotal', format: (val) => val?.toString() || '' },
    { label: 'Cardio Load', key: 'cardioLoad', format: (val) => val?.toString() || '' },
    { label: 'Unregistered Cardio Load (Estimation)', key: 'unregisteredCardioLoad', format: (val) => val?.toString() || '' },
  ];

  return (
    <div className="bg-purple-50 rounded-lg p-4 mb-6">
      <h3 className="text-xl font-bold text-purple-900 mb-4">📈 Other</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold sticky left-0 bg-purple-600 z-10 min-w-[260px]">
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
              <tr key={metric.key} className="hover:bg-purple-50 transition">
                <td className="border border-gray-300 px-3 py-2 font-medium bg-purple-100 sticky left-0 z-10">
                  {metric.label}
                </td>
                {dates.map((date) => {
                  const data = otherData[date];
                  const value = data?.[metric.key];
                  const displayValue = metric.format && value !== undefined
                    ? metric.format(value)
                    : value || '';

                  return (
                    <td
                      key={`${date}-${metric.key}`}
                      className="border border-gray-300 px-2 py-2 text-center cursor-pointer hover:bg-purple-100 transition"
                      onClick={() => onCellClick(date)}
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

export default OtherMetricsSection;
