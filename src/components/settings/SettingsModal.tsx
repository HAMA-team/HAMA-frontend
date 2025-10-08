import { useState, useEffect } from 'react';
import { AUTOMATION_LEVELS, AutomationLevel } from '@/types/automation';

interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
}

const RISK_PROFILES = [
  { value: 'conservative', label: '안정형', icon: '🛡️' },
  { value: 'moderate', label: '중립형', icon: '⚖️' },
  { value: 'aggressive', label: '공격형', icon: '🚀' },
];

export function SettingsModal({ show, onClose }: SettingsModalProps) {
  const [automationLevel, setAutomationLevel] = useState<AutomationLevel>(AutomationLevel.COPILOT);
  const [riskProfile, setRiskProfile] = useState('moderate');
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const savedLevel = localStorage.getItem('automation_level');
    const savedProfile = localStorage.getItem('risk_profile');
    const savedOnboarding = localStorage.getItem('onboarding_completed');

    if (savedLevel) setAutomationLevel(Number(savedLevel) as AutomationLevel);
    if (savedProfile) setRiskProfile(savedProfile);
    if (savedOnboarding) setOnboardingCompleted(savedOnboarding === 'true');
  }, [show]);

  const handleSave = () => {
    localStorage.setItem('automation_level', String(automationLevel));
    localStorage.setItem('risk_profile', riskProfile);
    localStorage.setItem('onboarding_completed', String(onboardingCompleted));
    onClose();
  };

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-scale-in"
          style={{ animation: 'scale-in 200ms ease-out' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              ⚙️ 설정
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* 자동화 레벨 */}
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                자동화 레벨
              </h3>
              <div className="space-y-3">
                {AUTOMATION_LEVELS.map((level) => (
                  <label
                    key={level.level}
                    className={`block border-2 rounded-lg p-4 cursor-pointer
                               transition-all duration-200
                               ${
                                 automationLevel === level.level
                                   ? 'border-primary-500 bg-primary-50'
                                   : 'border-gray-200 hover:border-gray-300'
                               }`}
                    style={{
                      borderColor:
                        automationLevel === level.level
                          ? 'var(--color-primary-500)'
                          : 'var(--border-default)',
                      backgroundColor:
                        automationLevel === level.level
                          ? 'var(--color-primary-50)'
                          : 'transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="automation-level"
                      value={level.level}
                      checked={automationLevel === level.level}
                      onChange={(e) => setAutomationLevel(Number(e.target.value) as AutomationLevel)}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{level.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                          {level.label}
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {level.description}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                          {level.interventionFrequency}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 투자 성향 */}
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                투자 성향
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {RISK_PROFILES.map((profile) => (
                  <button
                    key={profile.value}
                    onClick={() => setRiskProfile(profile.value)}
                    className={`py-3 px-4 rounded-lg border-2 font-medium text-sm
                               transition-all duration-200`}
                    style={{
                      borderColor:
                        riskProfile === profile.value
                          ? 'var(--color-primary-500)'
                          : 'var(--border-default)',
                      backgroundColor:
                        riskProfile === profile.value
                          ? 'var(--color-primary-50)'
                          : 'transparent',
                      color:
                        riskProfile === profile.value
                          ? 'var(--color-primary-700)'
                          : 'var(--text-primary)',
                    }}
                  >
                    <div className="text-2xl mb-1">{profile.icon}</div>
                    <div>{profile.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 온보딩 완료 체크박스 */}
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                기타 설정
              </h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onboardingCompleted}
                  onChange={(e) => setOnboardingCompleted(e.target.checked)}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: 'var(--color-primary-500)' }}
                />
                <div>
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    온보딩 완료
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    체크 해제 시 다음 방문에 온보딩을 다시 볼 수 있습니다
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button onClick={handleSave} className="btn btn-primary flex-1">
              저장
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--color-gray-100)',
                color: 'var(--text-primary)',
              }}
            >
              취소
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
