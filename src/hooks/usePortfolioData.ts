import { useState, useEffect } from 'react';
import { mockPortfolioData } from '@/lib/mockData';

// 포트폴리오 데이터 타입을 mock 데이터로부터 추론합니다.
export type PortfolioData = typeof mockPortfolioData;

// 차트 색상을 훅에서 직접 내보내서 컴포넌트의 의존성을 줄입니다.
export const CHART_COLORS = [
  'var(--color-primary-500)',   // 삼성전자
  'var(--color-secondary-500)',  // NAVER
  'var(--color-accent-500)',     // SK하이닉스
  'var(--color-info-500)',       // LG화학
  'var(--color-gray-400)',       // 현금
];

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 데이터 로딩 시뮬레이션
    const fetchData = () => {
      try {
        // TODO: 나중에 실제 API 호출 코드로 교체
        // const response = await fetch('/api/portfolio');
        // const result = await response.json();
        // setData(result);

        // Mock 데이터 사용
        setData(mockPortfolioData);
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
