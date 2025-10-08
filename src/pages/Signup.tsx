import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Signup() {
  const navigate = useNavigate();
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 19 || ageNum > 120) {
      setError('올바른 나이를 입력해주세요 (만 19세 이상)');
      return;
    }

    // 나이 저장
    localStorage.setItem('user_age', age);

    // 온보딩으로 이동
    navigate('/onboarding');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-subtle)' }}
    >
      <div className="w-full max-w-md mx-auto px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-5xl">🦛</span>
            <h1 className="text-4xl font-bold" style={{ color: 'var(--color-primary-600)' }}>
              HAMA
            </h1>
          </div>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            시작하기 전에 간단한 정보를 입력해주세요
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                나이 (만 나이)
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setError('');
                }}
                placeholder="예: 30"
                className="input"
                min="19"
                max="120"
                required
              />
              {error && (
                <p className="mt-2 text-sm" style={{ color: 'var(--color-danger-600)' }}>
                  {error}
                </p>
              )}
              <p className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                * 만 19세 이상만 가입 가능합니다
              </p>
            </div>

            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: 'var(--color-info-50)', border: '1px solid var(--color-info-200)' }}
            >
              <p className="text-sm" style={{ color: 'var(--color-info-700)' }}>
                ℹ️ 입력하신 정보는 투자 성향 분석에만 활용되며, 안전하게 보관됩니다.
              </p>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              다음 단계로
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm"
            style={{ color: 'var(--text-link)' }}
          >
            ← 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
