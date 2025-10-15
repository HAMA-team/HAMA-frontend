import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePortfolioData, CHART_COLORS } from '@/hooks/usePortfolioData';
import { RefreshCw, MessageSquare } from 'lucide-react';

// 스켈레톤 컴포넌트
const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`card ${className}`}>
    <div className="space-y-4 animate-pulse">
      <div className="skeleton h-8 w-1/3 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="skeleton h-12 w-full rounded"></div>
        <div className="skeleton h-12 w-full rounded"></div>
        <div className="skeleton h-12 w-full rounded"></div>
      </div>
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className="card">
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="skeleton h-8 w-1/4 rounded"></div>
        <div className="skeleton h-10 w-1/3 rounded"></div>
      </div>
      <div className="skeleton h-64 w-full rounded"></div>
    </div>
  </div>
);

export function Portfolio() {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState('1m');
  const { data, isLoading, error } = usePortfolioData();

  const handleRebalanceRequest = () => {
    navigate('/chat', { state: { initialMessage: '포트폴리오 리밸런싱 해줘' } });
  };

  const handleStockDetailRequest = (stockName: string) => {
    navigate('/chat', { state: { initialMessage: `${stockName} 상세 분석해줘` } });
  };

  if (isLoading) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonChart />
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="card text-center">
          <p style={{ color: 'var(--color-danger-600)' }}>{error || '데이터를 불러올 수 없습니다.'}</p>
          <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>새로고침</button>
        </div>
      </main>
    );
  }

  const { summary, performanceData, allocationData, holdings, cash, cashPercentage } = data;

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="space-y-6">
        {/* 상단 요약 카드 */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                총 평가액
              </h3>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ₩{summary.totalValue.toLocaleString()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                투자 원금
              </h3>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ₩{summary.principal.toLocaleString()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                평가 손익
              </h3>
              <div className="flex items-baseline gap-2">
                <p
                  className="text-3xl font-bold"
                  style={{
                    color:
                      summary.profit >= 0
                        ? 'var(--color-success-600)'
                        : 'var(--color-danger-600)',
                  }}
                >
                  {summary.profit >= 0 ? '+' : ''}₩{summary.profit.toLocaleString()}
                </p>
                <span
                  className="text-xl font-semibold"
                  style={{
                    color:
                      summary.profitRate >= 0
                        ? 'var(--color-success-600)'
                        : 'var(--color-danger-600)',
                  }}
                >
                  ({summary.profitRate >= 0 ? '+' : ''}
                  {summary.profitRate}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 차트 섹션 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              성과 분석
            </h2>
            <div className="flex gap-1 p-1 rounded-lg bg-secondary">
              <button onClick={() => setActivePeriod('1m')} className={`px-3 py-1 text-sm rounded-md transition-colors ${activePeriod === '1m' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                1개월
              </button>
              <button onClick={() => setActivePeriod('3m')} className={`px-3 py-1 text-sm rounded-md transition-colors ${activePeriod === '3m' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                3개월
              </button>
              <button onClick={() => setActivePeriod('1y')} className={`px-3 py-1 text-sm rounded-md transition-colors ${activePeriod === '1y' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                1년
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 수익률 추이 라인 차트 */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} tickFormatter={(value) => new Intl.NumberFormat('ko-KR', { notation: 'compact' }).format(value)} />
                  <Tooltip formatter={(value) => `${Number(value).toLocaleString()}원`} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 자산 배분 파이 차트 */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} ${entry.value}%`}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {allocationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => `${value}% (${Number(allocationData.find(d => d.name === name)?.amount).toLocaleString()}원)`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 보유 종목 리스트 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            보유 종목
          </h2>

          {holdings.map((stock) => (
            <div key={stock.code} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {stock.name}
                    </h3>
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      ({stock.code})
                    </span>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: stock.percentage >= 30 ? 'var(--color-warning-100)' : 'var(--color-gray-100)',
                        color: stock.percentage >= 30 ? 'var(--color-warning-700)' : 'var(--color-gray-700)',
                      }}
                    >
                      비중 {stock.percentage}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>보유 수량</span>
                      <p className="font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                        {stock.quantity}주
                      </p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>평가 금액</span>
                      <p className="font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                        ₩{stock.value.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>평균 단가</span>
                      <p className="font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                        ₩{stock.avgPrice.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>평가 손익</span>
                      <p
                        className="font-semibold mt-1"
                        style={{
                          color:
                            stock.profitRate >= 0
                              ? 'var(--color-success-600)'
                              : 'var(--color-danger-600)',
                        }}
                      >
                        {stock.profitRate >= 0 ? '+' : ''}
                        {stock.profitRate}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-6">
                  <button onClick={() => handleStockDetailRequest(stock.name)} className="btn btn-outline btn-sm">상세보기</button>
                </div>
              </div>
            </div>
          ))}

          {/* 현금 */}
          <div
            className="rounded-xl border p-6"
            style={{ backgroundColor: 'var(--color-gray-50)', borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  현금
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  비중 {cashPercentage}%
                </p>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ₩{cash.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="flex gap-4 mt-8">
          <button onClick={handleRebalanceRequest} className="inline-flex items-center justify-center gap-2 btn btn-primary flex-1">
            <RefreshCw className="h-4 w-4" strokeWidth={2} />
            리밸런싱 요청
          </button>

          <button onClick={() => navigate('/chat')} className="inline-flex items-center justify-center gap-2 btn btn-outline flex-1">
            <MessageSquare className="h-4 w-4" strokeWidth={2} />
            종목 추가 문의
          </button>
        </div>
      </div>
    </main>
  );
}
