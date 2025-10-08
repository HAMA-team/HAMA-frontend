import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useMockChat } from '@/hooks/useMockChat';
import { useApproval } from '@/hooks/useApproval';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { AutomationLevel, AUTOMATION_LEVELS } from '@/types/automation';
import type { TradeApprovalData } from '@/types/chat';

export function Chat() {
  const [automationLevel, setAutomationLevel] = useState<AutomationLevel>(
    AutomationLevel.COPILOT
  );
  const [isMockMode, setIsMockMode] = useState(false);
  const [userNotes, setUserNotes] = useState('');

  const realChat = useChat();
  const { approve, isSubmitting } = useApproval();
  const mockChat = useMockChat();

  const {
    messages,
    isLoading,
    awaitingApproval,
    approvalRequest,
    error,
    send,
    clearApproval,
    reset,
  } = isMockMode ? mockChat : realChat;

  const handleSendMessage = async (message: string) => {
    try {
      await send(message, automationLevel);
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const handleApproval = async (decision: 'approved' | 'rejected') => {
    if (!approvalRequest) return;

    try {
      if (isMockMode) {
        await mockChat.handleMockApproval(decision, userNotes);
      } else {
        await approve(approvalRequest.thread_id, decision, automationLevel, { userNotes });
      }
      clearApproval();
      setUserNotes('');
    } catch (err) {
      console.error('Approval error:', err);
      alert('승인 처리 중 오류가 발생했습니다.');
    }
  };

  const tradeData =
    approvalRequest?.type === 'trade_approval'
      ? (approvalRequest.interrupt_data as TradeApprovalData)
      : null;

  return (
    <div
      className="flex relative"
      style={{
        height: 'calc(100vh - 64px)',
        backgroundColor: 'var(--bg-subtle)',
      }}
    >
      {/* Mock/API 모드 오버레이 (우측 하단) */}
      <div className="fixed bottom-4 right-4 z-10">
        <button
          onClick={() => {
            setIsMockMode(!isMockMode);
            reset();
          }}
          className="px-3 py-2 rounded-full shadow-lg font-medium text-xs transition-all"
          style={{
            backgroundColor: isMockMode ? 'var(--color-secondary-500)' : 'var(--color-gray-600)',
            color: 'white',
            opacity: 0.7,
          }}
          title={isMockMode ? 'Mock 모드 (클릭하여 API 모드로)' : 'API 모드 (클릭하여 Mock 모드로)'}
        >
          {isMockMode ? '🎭 Mock' : '🔌 API'}
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className={`flex flex-col flex-1 transition-all ${awaitingApproval ? 'mr-[400px]' : ''}`}>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 mt-4">
            <p style={{ color: 'var(--color-danger-700)' }}>
              <strong>오류:</strong> {error}
            </p>
          </div>
        )}

        {/* 시작 안내 메시지 (메시지가 없을 때만) */}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-2xl text-center space-y-6">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                HAMA와 대화를 시작하세요
              </h2>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                투자에 관한 모든 것을 물어보세요. AI가 분석하고, 당신이 결정합니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
                <button
                  onClick={() => handleSendMessage('삼성전자 분석해줘')}
                  className="card hover:shadow-md transition-all text-left p-4"
                >
                  <div className="text-xl mb-2">📊</div>
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    "삼성전자 분석해줘"
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    종목 분석 및 투자 의견
                  </p>
                </button>

                <button
                  onClick={() => handleSendMessage('삼성전자 10주 매수해줘')}
                  className="card hover:shadow-md transition-all text-left p-4"
                >
                  <div className="text-xl mb-2">💰</div>
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    "삼성전자 10주 매수해줘"
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    매수 주문 (HITL 승인)
                  </p>
                </button>

                <button
                  onClick={() => handleSendMessage('네이버 5주 매도해줘')}
                  className="card hover:shadow-md transition-all text-left p-4"
                >
                  <div className="text-xl mb-2">📉</div>
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    "네이버 5주 매도해줘"
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    매도 주문 (HITL 승인)
                  </p>
                </button>

                <button
                  onClick={() => handleSendMessage('리밸런싱 해줘')}
                  className="card hover:shadow-md transition-all text-left p-4"
                >
                  <div className="text-xl mb-2">🔄</div>
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    "리밸런싱 해줘"
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    포트폴리오 재조정
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        <MessageList messages={messages} isLoading={isLoading} />
        <MessageInput
          onSend={handleSendMessage}
          disabled={isLoading || awaitingApproval}
          placeholder={
            awaitingApproval ? '승인 대기 중...' : 'HAMA에게 메시지를 보내세요...'
          }
        />
      </div>

      {/* 승인 사이드패널 */}
      <div
        className={`fixed right-0 top-[64px] h-[calc(100vh-64px)] w-[400px]
                    bg-white border-l-2 shadow-2xl overflow-y-auto p-6
                    transform transition-transform duration-300 ease-out
                    ${awaitingApproval ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ borderColor: 'var(--color-warning-300)' }}
      >
        {approvalRequest && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">⚠️</span>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                승인이 필요합니다
              </h2>
            </div>

            <div className="space-y-4">
              <div
                className="rounded-lg p-4"
                style={{
                  backgroundColor: 'var(--color-warning-50)',
                  borderColor: 'var(--color-warning-200)',
                  border: '1px solid',
                }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {approvalRequest.message}
                </p>
              </div>

              {tradeData && (
                <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: 'var(--color-gray-50)' }}>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      종목
                    </span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {tradeData.stock_name || tradeData.stock_code}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      주문
                    </span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {tradeData.order_type === 'buy' ? '매수' : '매도'} {tradeData.quantity}주
                    </span>
                  </div>
                  {tradeData.estimated_total && (
                    <div className="flex justify-between pt-3 border-t" style={{ borderColor: 'var(--border-default)' }}>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        총액
                      </span>
                      <span className="font-bold text-lg" style={{ color: 'var(--color-primary-600)' }}>
                        ₩{tradeData.estimated_total.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  메모 (선택)
                </label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="승인/거부 사유를 입력하세요"
                  className="input w-full text-sm"
                  rows={3}
                />
              </div>
            </div>

            <div className="sticky bottom-0 left-0 right-0 bg-white border-t pt-4 mt-6" style={{ borderColor: 'var(--border-default)' }}>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApproval('approved')}
                  disabled={isSubmitting}
                  className="btn btn-success flex-1"
                >
                  ✅ 승인
                </button>
                <button
                  onClick={() => handleApproval('rejected')}
                  disabled={isSubmitting}
                  className="btn btn-danger flex-1"
                >
                  ❌ 거부
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
