'use client';

import dynamic from 'next/dynamic';

const AnalyticsChartClient = dynamic(() => import('./AnalyticsChartClient'), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] flex items-center justify-center text-sm opacity-50">
      Loading chart...
    </div>
  ),
});

export default AnalyticsChartClient;
