import { mockPortfolioData } from './portfolio';

// 포트폴리오 데이터에서 대시보드용 데이터를 생성하여 일관성을 유지합니다.
const { summary, holdings, recentActivities: portfolioRecentActivities } = mockPortfolioData;

// 대시보드용 최근 활동 데이터는 포트폴리오 데이터와 다를 수 있으므로, 일부만 사용하거나 별도 정의합니다.
// 여기서는 포트폴리오의 거래 내역을 대시보드 활동으로 변환하는 예시를 보여줍니다.
const recentActivities = portfolioRecentActivities.slice(0, 4);

export const mockDashboardData = {
  accountConnection: {
    broker: '한국투자증권',
    status: 'connected',
    accountNumber: '1234-5678-9012',
  },
  automationLevel: {
    level: 2,
    name: '코파일럿 모드',
    description: '매매/리밸런싱 실행 시 사용자 승인이 필요합니다.',
  },
  totalAssets: {
    value: summary.totalValue,
    profit: summary.profit,
    profitRate: summary.profitRate,
    reference: '전일 종가 기준',
  },
  portfolioSummary: {
    holdings: holdings.slice(0, 4).map(h => ({ ...h })),
    cash: mockPortfolioData.cashPercentage,
    totalStocks: holdings.length,
  },
  recentActivities: recentActivities,
};
