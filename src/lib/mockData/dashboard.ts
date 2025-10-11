// Mock data for Dashboard

export const mockDashboardData = {
  // 계좌 연결 상태
  accountConnection: {
    broker: '한국투자증권',
    status: 'connected',
    accountNumber: '1234-5678-9012',
  },

  // 자동화 레벨
  automationLevel: {
    level: 2,
    name: '코파일럿 모드',
    description: '매매/리밸런싱 실행 시 사용자 승인이 필요합니다.',
  },

  // 총 자산
  totalAssets: {
    value: 12345678,
    profit: 1234567,
    profitRate: 11.25,
    reference: '전일 종가 기준',
  },

  // 포트폴리오 요약 (상위 4개 종목 + 현금)
  portfolioSummary: {
    holdings: [
      {
        code: '005930',
        name: '삼성전자',
        percentage: 42.5,
        profit: 5.8,
      },
      {
        code: '035420',
        name: 'NAVER',
        percentage: 25.1,
        profit: 12.3,
      },
      {
        code: '000660',
        name: 'SK하이닉스',
        percentage: 18.3,
        profit: -3.2,
      },
      {
        code: '051910',
        name: 'LG화학',
        percentage: 8.1,
        profit: 6.1,
      },
    ],
    cash: 6.0,
    totalStocks: 5,
  },

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
};
