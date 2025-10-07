import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useMockChat } from '@/hooks/useMockChat';
import { useApproval } from '@/hooks/useApproval';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ApprovalDialog } from './ApprovalDialog';
import { AutomationLevel, AUTOMATION_LEVELS } from '@/types/automation';

export function ChatInterface() {
  const [automationLevel, setAutomationLevel] = useState<AutomationLevel>(
    AutomationLevel.COPILOT
  );
  const [isMockMode, setIsMockMode] = useState(false);

  // 실제 API 모드
  const realChat = useChat();
  const { approve, isSubmitting } = useApproval();

  // Mock 모드
  const mockChat = useMockChat();

  // 현재 모드에 따라 선택
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
      // 에러는 useChat에서 처리됨
      console.error('Send message error:', err);
    }
  };

  const handleApproval = async (
    decision: 'approved' | 'rejected',
    userNotes?: string
  ) => {
    if (!approvalRequest) return;

    try {
      if (isMockMode) {
        // Mock 모드: Mock 승인 처리
        await mockChat.handleMockApproval(decision, userNotes);
      } else {
        // 실제 API 모드
        const response = await approve(
          approvalRequest.thread_id,
          decision,
          automationLevel,
          { userNotes }
        );
        console.log('Approval response:', response);
      }

      clearApproval();
    } catch (err) {
      console.error('Approval error:', err);
      alert('승인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                HAMA AI 투자 어시스턴트
              </h1>
              <p className="text-sm text-gray-600">AI가 분석하고, 당신이 결정한다</p>
            </div>

            {/* 컨트롤 */}
            <div className="flex items-center gap-3">
              {/* Mock 모드 토글 */}
              <button
                onClick={() => {
                  setIsMockMode(!isMockMode);
                  reset(); // 모드 변경 시 대화 초기화
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  isMockMode
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Mock 모드: 백엔드 없이 테스트"
              >
                {isMockMode ? '🎭 Mock 모드' : '🔌 실제 API'}
              </button>

              <span className="text-sm font-medium text-gray-700">자동화 레벨:</span>
              <select
                value={automationLevel}
                onChange={(e) => setAutomationLevel(Number(e.target.value) as AutomationLevel)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {AUTOMATION_LEVELS.map((level) => (
                  <option key={level.level} value={level.level}>
                    {level.icon} {level.label}
                  </option>
                ))}
              </select>

              {/* 초기화 버튼 */}
              <button
                onClick={reset}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="대화 초기화"
              >
                🔄 초기화
              </button>
            </div>
          </div>

          {/* Mock 모드 안내 */}
          {isMockMode && (
            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm font-semibold text-purple-900 mb-2">
                🎭 Mock 모드 활성화 - 백엔드 없이 테스트 가능!
              </p>
              <p className="text-xs text-purple-800">
                <strong>시도해보세요:</strong>
                <br />
                • "삼성전자 분석해줘" - 일반 분석 (승인 불필요)
                <br />
                • "삼성전자 10주 매수해줘" - 매수 주문 (HITL 승인)
                <br />
                • "네이버 5주 매도해줘" - 매도 주문 (HITL 승인)
                <br />
                • "리밸런싱 해줘" - 포트폴리오 리밸런싱 (HITL 승인)
              </p>
            </div>
          )}

          {/* 자동화 레벨 설명 */}
          {!isMockMode && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>
                  {AUTOMATION_LEVELS.find(l => l.level === automationLevel)?.label}:
                </strong>{' '}
                {AUTOMATION_LEVELS.find(l => l.level === automationLevel)?.description}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 mt-4">
          <p className="text-red-800">
            <strong>오류:</strong> {error}
          </p>
        </div>
      )}

      {/* 메시지 리스트 */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* 입력창 */}
      <MessageInput
        onSend={handleSendMessage}
        disabled={isLoading || awaitingApproval}
        placeholder={
          awaitingApproval
            ? '승인 대기 중...'
            : "메시지를 입력하세요 (예: '삼성전자 분석해줘', '네이버 10주 매수해줘')"
        }
      />

      {/* 승인 다이얼로그 */}
      {awaitingApproval && approvalRequest && (
        <ApprovalDialog
          request={approvalRequest}
          onApprove={(notes) => handleApproval('approved', notes)}
          onReject={(notes) => handleApproval('rejected', notes)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
