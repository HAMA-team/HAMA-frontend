import { useState, useEffect } from 'react';
import { mockPortfolioData } from '@/lib/mockData';

// 포트폴리오 데이터 타입을 mock 데이터로부터 추론합니다.
export type PortfolioData = typeof mockPortfolioData;

// 차트 색상 - 각 기업의 브랜드 컬러를 투명도로 조절하여 사용
export const getStockColor = (name: string): string => {
  const colorMap: Record<string, string> = {
    '삼성전자': 'rgba(20, 70, 180, 0.7)',      // Samsung Blue
    'NAVER': 'rgba(3, 199, 90, 0.7)',           // Naver Green
    'SK하이닉스': 'rgba(234, 0, 0, 0.7)',       // SK Red
    'LG화학': 'rgba(164, 26, 47, 0.7)',         // LG Red
    '카카오': 'rgba(254, 229, 0, 0.7)',         // Kakao Yellow
    '현대차': 'rgba(0, 44, 95, 0.7)',           // Hyundai Blue
    '기아': 'rgba(5, 20, 31, 0.7)',             // Kia Dark
    '현금': 'rgba(163, 163, 163, 0.5)',         // Gray
  };
  return colorMap[name] || 'rgba(115, 115, 115, 0.6)';
};

export const CHART_COLORS = [
  'rgba(20, 70, 180, 0.7)',   // 삼성전자
  'rgba(3, 199, 90, 0.7)',     // NAVER
  'rgba(234, 0, 0, 0.7)',      // SK하이닉스
  'rgba(164, 26, 47, 0.7)',    // LG화학
  'rgba(163, 163, 163, 0.5)',  // 현금
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
