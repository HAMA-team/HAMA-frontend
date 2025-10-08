import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingFlow } from '@/lib/mockData';

export function Onboarding() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = onboardingFlow[currentStepIndex];

  // 초기 메시지 표시
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: onboardingFlow[0].message,
        },
      ]);
    }
  }, [messages.length]);

  // inputType이 없는 단계는 자동으로 다음으로 (단, 마지막 단계가 아닐 때만)
  useEffect(() => {
    if (currentStep && !currentStep.inputType && currentStepIndex > 0 && currentStep.nextStep !== -1) {
      // Step 2 같은 경우 (inputType 없음, 마지막이 아님)
      const timer = setTimeout(() => {
        const nextStepId = currentStep.nextStep;
        const nextStep = onboardingFlow.find((s) => s.id === nextStepId);
        if (nextStep) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: nextStep.message,
            },
          ]);
          setCurrentStepIndex(onboardingFlow.indexOf(nextStep));
        }
      }, 1500); // 1.5초 후 자동 진행

      return () => clearTimeout(timer);
    }
  }, [currentStep, currentStepIndex]);

  // 다음 단계로 이동
  const handleNextStep = (userResponse: string) => {
    // 사용자 응답 추가
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userResponse,
      },
    ]);

    // 다음 단계 찾기
    const nextStepId = currentStep.nextStep;

    if (nextStepId === -1) {
      // 완료
      setIsComplete(true);
      localStorage.setItem('onboarding_completed', 'true');
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } else {
      const nextStep = onboardingFlow.find((s) => s.id === nextStepId);
      if (nextStep) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: nextStep.message,
            },
          ]);
          setCurrentStepIndex(onboardingFlow.indexOf(nextStep));
        }, 500);
      }
    }

    setInputValue('');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-subtle)' }}
    >
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-5xl">🦛</span>
            <h1 className="text-4xl font-bold" style={{ color: 'var(--color-primary-600)' }}>
              HAMA
            </h1>
          </div>
          <p className="text-gray-600">투자 성향 분석 및 서비스 설정</p>
        </div>

        {/* 대화 영역 */}
        <div
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          style={{ maxHeight: '500px', overflowY: 'auto' }}
        >
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 items-start ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-primary-100)' }}
                  >
                    🦛
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-xl px-4 py-3 ${
                    msg.role === 'assistant'
                      ? 'bg-white border border-gray-200'
                      : 'text-white'
                  }`}
                  style={{
                    backgroundColor:
                      msg.role === 'user' ? 'var(--color-primary-500)' : undefined,
                  }}
                >
                  <p
                    className="whitespace-pre-line leading-relaxed"
                    style={{
                      color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    }}
                  >
                    {msg.content}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-primary-600)' }}
                  >
                    👤
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 입력 영역 */}
        {!isComplete && (
          <div className="bg-white rounded-xl shadow-md p-6">
            {/* 마지막 단계 (완료 버튼) */}
            {!currentStep.inputType && currentStep.nextStep === -1 && (
              <div className="text-center">
                <button
                  onClick={() => {
                    setIsComplete(true);
                    localStorage.setItem('onboarding_completed', 'true');
                    setTimeout(() => {
                      navigate('/dashboard');
                    }, 2000);
                  }}
                  className="btn btn-primary w-full btn-lg"
                >
                  시작하기 🚀
                </button>
              </div>
            )}

            {/* 일반 입력 */}
            {currentStep.inputType && (
              <>
            {currentStep.inputType === 'text' && (
              <div>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="답변을 입력하세요..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3
                           focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--border-default)' }}
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
                      e.preventDefault();
                      handleNextStep(inputValue);
                    }
                  }}
                />
                <button
                  onClick={() => inputValue.trim() && handleNextStep(inputValue)}
                  disabled={!inputValue.trim()}
                  className="btn btn-primary w-full"
                >
                  다음
                </button>
              </div>
            )}

            {currentStep.inputType === 'select' && currentStep.options && (
              <div className="space-y-2">
                {currentStep.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleNextStep(option)}
                    className="w-full border-2 rounded-lg px-4 py-3 text-left
                             hover:border-primary-500 hover:bg-primary-50 transition-all"
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentStep.inputType === 'radio' && currentStep.options && (
              <div className="space-y-3">
                {currentStep.options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`block border-2 rounded-lg p-4 cursor-pointer
                             hover:border-primary-500 hover:bg-primary-50 transition-all
                             ${inputValue === option ? 'border-primary-500 bg-primary-50' : ''}`}
                    style={{
                      borderColor: inputValue === option
                        ? 'var(--color-primary-500)'
                        : 'var(--border-default)'
                    }}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={option}
                      checked={inputValue === option}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
                <button
                  onClick={() => inputValue && handleNextStep(inputValue)}
                  disabled={!inputValue}
                  className="btn btn-primary w-full mt-4"
                >
                  다음
                </button>
              </div>
            )}
            </>
            )}
          </div>
        )}

        {/* 완료 메시지 */}
        {isComplete && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              설정이 완료되었습니다!
            </h2>
            <p className="text-gray-600 mb-4">잠시 후 대시보드로 이동합니다...</p>
            <div className="loading-spinner mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}
