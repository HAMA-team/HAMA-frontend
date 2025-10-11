import { useState, useEffect } from 'react';
import { mockDashboardData } from '@/lib/mockData';

export type DashboardData = typeof mockDashboardData;

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 데이터 로딩 시뮬레이션
    const fetchData = () => {
      try {
        // TODO: 나중에 실제 API 호출 코드로 교체
        // const response = await fetch('/api/dashboard');
        // const result = await response.json();
        // setData(result);

        // Mock 데이터 사용
        setData(mockDashboardData);
      } catch (e) {
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 1000);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading, error };
}
