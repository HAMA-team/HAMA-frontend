// Mock data for Dashboard

export const mockDashboardData = {
  // 계좌 연결 상태
  accountConnection: {
    broker: '한국투자증권',
    status: 'connected',
    accountNumber: '1234-5678-9012',
  },

  // 총 자산
  totalAssets: {
    value: 10500000,
    profit: 500000,
    profitRate: 5.0,
  },

  // 포트폴리오 요약 (상위 4개 종목)
  portfolioSummary: [
    {
      code: '005930',
      name: '삼성전자',
      percentage: 35,
      profit: 8.5,
    },
    {
      code: '035420',
      name: 'NAVER',
      percentage: 25,
      profit: 12.3,
    },
    {
      code: '000660',
      name: 'SK하이닉스',
      percentage: 20,
      profit: -3.2,
    },
    {
      code: '051910',
      name: 'LG화학',
      percentage: 15,
      profit: 6.1,
    },
  ],

  // 최근 거래
  recentTrades: [
    {
      id: 'T001',
      stock_code: '005930',
      stock_name: '삼성전자',
      type: 'buy',
      quantity: 10,
      price: 89000,
      total: 890000,
      date: '2025-10-08 14:30',
    },
    {
      id: 'T002',
      stock_code: '035420',
      stock_name: 'NAVER',
      type: 'sell',
      quantity: 5,
      price: 250000,
      total: 1250000,
      date: '2025-10-07 10:15',
    },
    {
      id: 'T003',
      stock_code: '000660',
      stock_name: 'SK하이닉스',
      type: 'buy',
      quantity: 8,
      price: 145000,
      total: 1160000,
      date: '2025-10-06 16:45',
    },
  ],
};
