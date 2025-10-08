import { useNavigate } from 'react-router-dom';
import { mockDashboardData } from '@/lib/mockData';

export function Dashboard() {
  const navigate = useNavigate();
  const { accountConnection, totalAssets, portfolioSummary, recentTrades } = mockDashboardData;

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Masonry Grid */}
      <div className="grid grid-cols-12 gap-6 auto-rows-auto">
        {/* 계좌 연결 상태 카드 */}
        <div className="col-span-12 md:col-span-4">
          <div className="card transition-shadow hover:shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-success-100)' }}
              >
                <span style={{ color: 'var(--color-success-600)' }} className="text-xl">
                  ✓
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  증권사
                </h3>
                <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {accountConnection.broker}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--color-success-500)' }}
              ></span>
              <span className="text-xs" style={{ color: 'var(--color-success-700)' }}>
                연결됨
              </span>
            </div>
          </div>
        </div>

        {/* 총 자산 카드 (강조) */}
        <div className="col-span-12 md:col-span-8">
          <div
            className="rounded-xl p-8 shadow-lg text-white"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%)',
            }}
          >
            <h3 className="text-sm font-medium opacity-90 mb-2">총 자산</h3>
            <p className="text-4xl font-bold mb-4">₩{totalAssets.value.toLocaleString()}</p>
            <div className="flex items-center gap-2">
              {totalAssets.profitRate >= 0 ? (
                <>
                  <span className="text-2xl">↑</span>
                  <span className="text-xl font-semibold" style={{ color: '#86efac' }}>
                    +{totalAssets.profitRate}%
                  </span>
                  <span className="text-base opacity-75">
                    (+₩{totalAssets.profit.toLocaleString()})
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl">↓</span>
                  <span className="text-xl font-semibold" style={{ color: '#fca5a5' }}>
                    {totalAssets.profitRate}%
                  </span>
                  <span className="text-base opacity-75">
                    (₩{totalAssets.profit.toLocaleString()})
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 포트폴리오 요약 카드 */}
        <div className="col-span-12">
          <div className="card">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              포트폴리오 요약
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {portfolioSummary.map((stock) => (
                <div
                  key={stock.code}
                  className="pl-3"
                  style={{ borderLeft: '4px solid var(--color-primary-500)' }}
                >
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {stock.name}
                  </p>
                  <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {stock.percentage}%
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color:
                        stock.profit >= 0
                          ? 'var(--color-success-600)'
                          : 'var(--color-danger-600)',
                    }}
                  >
                    {stock.profit >= 0 ? '↑' : '↓'} {Math.abs(stock.profit)}%
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/portfolio')}
              className="mt-4 text-sm font-medium transition-colors"
              style={{ color: 'var(--color-primary-600)' }}
            >
              상세 보기 →
            </button>
          </div>
        </div>

        {/* 최근 거래 카드 */}
        <div className="col-span-12 md:col-span-7">
          <div className="card">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              최근 거래
            </h3>

            <div className="space-y-3">
              {recentTrades.slice(0, 3).map((trade) => (
                <div
                  key={trade.id}
                  className="flex justify-between items-center py-3 border-b last:border-0"
                  style={{ borderColor: 'var(--color-gray-100)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm`}
                      style={{
                        backgroundColor:
                          trade.type === 'buy'
                            ? 'var(--color-success-100)'
                            : 'var(--color-danger-100)',
                        color:
                          trade.type === 'buy'
                            ? 'var(--color-success-700)'
                            : 'var(--color-danger-700)',
                      }}
                    >
                      {trade.type === 'buy' ? '↑' : '↓'}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {trade.stock_name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {trade.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {trade.quantity}주
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      ₩{trade.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions 카드 */}
        <div className="col-span-12 md:col-span-5">
          <div className="card">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              빠른 작업
            </h3>

            <div className="space-y-3">
              <button onClick={() => navigate('/chat')} className="btn btn-primary w-full">
                💬 HAMA와 대화하기
              </button>

              <button
                onClick={() => navigate('/portfolio')}
                className="btn btn-outline w-full"
              >
                📊 포트폴리오 상세
              </button>

              <button className="btn btn-ghost w-full">📈 시장 분석</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
