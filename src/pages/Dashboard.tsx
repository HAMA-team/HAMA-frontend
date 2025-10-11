import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useDashboardData } from '@/hooks/useDashboardData';
import type { DashboardData } from '@/hooks/useDashboardData';

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'trade_buy':
      return <span className="text-success-700">↑</span>;
    case 'trade_sell':
      return <span className="text-danger-700">↓</span>;
    case 'ai_suggestion':
      return <span className="text-info-700">💡</span>;
    case 'risk_warning':
      return <span className="text-warning-700">⚠️</span>;
    default:
      return null;
  }
};

const Skeleton = ({ className = '' }: { className?: string }) => <div className={`skeleton ${className}`} />;
export function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6 auto-rows-auto">
          <div className="col-span-12 md:col-span-4"><Skeleton className="h-28" /></div>
          <div className="col-span-12 md:col-span-8"><Skeleton className="h-28" /></div>
          <div className="col-span-12 lg:col-span-7"><Skeleton className="h-60" /></div>
          <div className="col-span-12 lg:col-span-5"><Skeleton className="h-60" /></div>
          <div className="col-span-12"><Skeleton className="h-40" /></div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="card text-center">
          <p style={{ color: 'var(--color-danger-600)' }}>{error || '데이터를 불러올 수 없습니다.'}</p>
          <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>새로고침</button>
        </div>
      </main>
    );
  }

  const { totalAssets, portfolioSummary, recentActivities } = data;

  const chartData = [
    ...portfolioSummary.holdings.map((h) => ({ name: h.name, value: h.percentage })),
    { name: '현금', value: portfolioSummary.cash },
  ];
  const CHART_COLORS = ['#6366f1', '#a855f7', '#06b6d4', '#f59e0b', '#9ca3af'];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-12 gap-6 auto-rows-auto">
        {/* 계좌 연결 상태 카드 - 이 부분은 전역 상태 또는 다른 훅에서 가져와야 할 수 있습니다. */}
        <div className="col-span-12 md:col-span-4">
          <div className="card h-full">
            <h3 className="text-lg font-bold mb-4">계정 상태</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">증권사</span>
                <span className="font-semibold">{data.accountConnection.broker}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">자동화 레벨</span>
                <span className="font-semibold badge badge-info">
                  {data.automationLevel.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 총 자산 카드 (강조) */}
        <div
          className="col-span-12 md:col-span-8 card cursor-pointer transition-all hover:transform hover:-translate-y-1"
          onClick={() => navigate('/portfolio')}
          style={{
            background:
              'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%)',
          }}
        >
          <div className="text-white">
            <h3 className="text-sm font-medium opacity-90 mb-1">총 자산</h3>
            <p className="text-4xl font-bold">₩{totalAssets.value.toLocaleString()}</p>
            <div className="flex items-baseline justify-between mt-2">
              <div className="flex items-center gap-2">
                {totalAssets.profitRate >= 0 ? (
                  <span className="text-xl font-semibold text-green-300">
                    +₩{totalAssets.profit.toLocaleString()} (+{totalAssets.profitRate}%)
                  </span>
                ) : (
                  <span className="text-xl font-semibold text-red-300">
                    ₩{totalAssets.profit.toLocaleString()} ({totalAssets.profitRate}%)
                  </span>
                )}
              </div>
              <span className="text-xs opacity-80">{totalAssets.reference}</span>
            </div>
          </div>
        </div>

        {/* 포트폴리오 요약 카드 */}
        <div className="col-span-12 lg:col-span-7">
          <div className="card h-full">
            <h3 className="text-lg font-bold mb-4">포트폴리오 요약</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      innerRadius={50}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-lg font-bold">
                      {`${portfolioSummary.totalStocks} 종목`}
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {portfolioSummary.holdings.slice(0, 4).map((stock) => (
                  <div key={stock.code} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{stock.name}</span>
                    <span className="text-sm font-semibold">{stock.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => navigate('/portfolio')}
              className="btn btn-ghost btn-sm mt-4"
            >
              포트폴리오 전체 보기 →
            </button>
          </div>
        </div>

        {/* 최근 활동 카드 */}
        <div className="col-span-12 lg:col-span-5">
          <div className="card h-full">
            <h3 className="text-lg font-bold mb-4">최근 활동</h3>
            <div className="space-y-3">
              {recentActivities.slice(0, 4).map((activity: DashboardData['recentActivities'][number]) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-lg`}
                  >
                    <ActivityIcon type={activity.type} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">{activity.content}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: ko })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions 카드 */}
        <div className="col-span-12">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">빠른 실행</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => navigate('/chat')} className="btn btn-primary btn-lg">
                💬 HAMA와 대화하기
              </button>
              <button onClick={() => navigate('/chat')} className="btn btn-outline btn-lg">
                🔄 포트폴리오 리밸런싱
              </button>
              <button onClick={() => navigate('/chat')} className="btn btn-outline btn-lg">
                📈 최신 시장 동향 분석
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
