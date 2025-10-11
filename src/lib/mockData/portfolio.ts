// Mock data for Portfolio

export const mockPortfolioData = {
  // 상단 요약
  summary: {
    totalValue: 10500000,
    principal: 10000000,
    profit: 500000,
    profitRate: 5.0,
  },

  // 수익률 추이 데이터 (라인 차트용)
  performanceData: [
    { date: '09-01', value: 10000000 },
    { date: '09-08', value: 10150000 },
    { date: '09-15', value: 10050000 },
    { date: '09-22', value: 10300000 },
    { date: '09-29', value: 10250000 },
    { date: '10-06', value: 10500000 },
  ],

  // 자산 배분 (파이 차트용)
  allocationData: [
    { name: '삼성전자', value: 35, amount: 3675000 },
    { name: 'NAVER', value: 25, amount: 2625000 },
    { name: 'SK하이닉스', value: 20, amount: 2100000 },
    { name: 'LG화학', value: 15, amount: 1575000 },
    { name: '현금', value: 5, amount: 525000 },
  ],

  // 보유 종목 상세
  holdings: [
    {
      code: '005930',
      name: '삼성전자',
      quantity: 40,
      avgPrice: 85000,
      currentPrice: 89000,
      value: 3560000,
      profit: 160000,
      profitRate: 4.7,
      percentage: 35,
    },
    {
      code: '035420',
      name: 'NAVER',
      quantity: 10,
      currentPrice: 250000,
      avgPrice: 230000,
      value: 2500000,
      profit: 200000,
      profitRate: 8.7,
      percentage: 25,
    },
    {
      code: '000660',
      name: 'SK하이닉스',
      quantity: 15,
      avgPrice: 150000,
      currentPrice: 145000,
      value: 2175000,
      profit: -75000,
      profitRate: -3.3,
      percentage: 20,
    },
    {
      code: '051910',
      name: 'LG화학',
      quantity: 4,
      avgPrice: 390000,
      currentPrice: 410000,
      value: 1640000,
      profit: 80000,
      profitRate: 5.1,
      percentage: 15,
    },
  ],

  // 최근 활동
  recentActivities: [
    {
      id: 'A001',
      type: 'trade_buy',
      content: '삼성전자 10주 매수 완료',
      timestamp: new Date('2025-10-11T14:30:00'),
    },
    {
      id: 'A002',
      type: 'ai_suggestion',
      content: 'AI 제안: IT 섹터 비중 확대',
      timestamp: new Date('2025-10-11T09:15:00'),
    },
    {
      id: 'A003',
      type: 'risk_warning',
      content: '리스크 경고: 단일 종목 비중 40% 초과',
      timestamp: new Date('2025-10-10T11:00:00'),
    },
    {
      id: 'A004',
      type: 'trade_sell',
      content: 'NAVER 5주 매도 완료',
      timestamp: new Date('2025-10-09T10:15:00'),
    },
  ],

  // 현금
  cash: 525000,
  cashPercentage: 5,
};
