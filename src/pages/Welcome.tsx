import { useNavigate } from 'react-router-dom';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-subtle)' }}
    >
      <div className="text-center px-4">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-8xl">🦛</span>
          </div>
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--color-primary-600)' }}>
            HAMA
          </h1>
          <p className="text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
            Human-in-the-Loop AI Multiagent
          </p>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Investment System
          </p>
        </div>

        {/* Tagline */}
        <div className="mb-12">
          <p className="text-3xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            AI가 분석하고, 당신이 결정한다
          </p>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            든든하고 신뢰할 수 있는 AI 투자 파트너
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/signup')}
          className="btn btn-primary btn-lg px-12 py-4 text-xl"
        >
          시작하기
        </button>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div>
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              실시간 시장 분석
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              AI가 24/7 시장을 모니터링하고 분석합니다
            </p>
          </div>

          <div>
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              투명한 의사결정
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              모든 투자 결정은 당신의 승인을 받습니다
            </p>
          </div>

          <div>
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              포트폴리오 관리
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              자동 리밸런싱과 리스크 관리를 제공합니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
