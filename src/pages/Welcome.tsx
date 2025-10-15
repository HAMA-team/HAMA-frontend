import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle2, BarChart3, ArrowRight } from 'lucide-react';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="space-y-4">
            <h1 className="text-5xl font-semibold tracking-tighter text-foreground">
              HAMA
            </h1>
            <p className="text-xl text-muted-foreground">
              Human-in-the-Loop AI Multiagent Investment System
            </p>
          </div>

          {/* Tagline */}
          <div className="space-y-3 py-8">
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              AI가 분석하고, 당신이 결정한다
            </p>
            <p className="text-lg text-muted-foreground">
              든든하고 신뢰할 수 있는 AI 투자 파트너
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors gap-2"
            >
              시작하기
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="rounded-full bg-accent p-3">
                  <Search className="h-6 w-6 text-accent-foreground" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-base font-semibold text-foreground">
                실시간 시장 분석
              </h3>
              <p className="text-sm text-muted-foreground">
                AI가 24/7 시장을 모니터링하고 분석합니다
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="rounded-full bg-accent p-3">
                  <CheckCircle2 className="h-6 w-6 text-accent-foreground" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-base font-semibold text-foreground">
                투명한 의사결정
              </h3>
              <p className="text-sm text-muted-foreground">
                모든 투자 결정은 당신의 승인을 받습니다
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="rounded-full bg-accent p-3">
                  <BarChart3 className="h-6 w-6 text-accent-foreground" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-base font-semibold text-foreground">
                포트폴리오 관리
              </h3>
              <p className="text-sm text-muted-foreground">
                자동 리밸런싱과 리스크 관리를 제공합니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
