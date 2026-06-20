'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ChartDataPoint {
  date: string;
  views: number;
  clicks: number;
}

interface AnalyticsChartProps {
  data: ChartDataPoint[];
  theme: 'dark' | 'light';
}

export default function AnalyticsChartClient({ data, theme }: AnalyticsChartProps) {
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#333' : '#e5e7eb';
  const textColor = isDark ? '#9ca3af' : '#6b7280';

  // Only show the last 14 days for readability
  const recentData = data.slice(-14);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={recentData}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: textColor }}
          tickFormatter={(val: string) => {
            const d = new Date(val);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
        />
        <YAxis tick={{ fontSize: 10, fill: textColor }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#1f1f23' : '#fff',
            border: `1px solid ${isDark ? '#333' : '#e5e7eb'}`,
            borderRadius: '8px',
            color: isDark ? '#fff' : '#000',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line
          type="monotone"
          dataKey="views"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
