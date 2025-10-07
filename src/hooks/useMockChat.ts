import { useState, useCallback } from 'react';
import type { ChatMessage, ApprovalRequest } from '@/types/chat';
import { AutomationLevel } from '@/types/automation';
import { getMockResponse, getMockApprovalResponse } from '@/lib/api/mock';

export function useMockChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (
    message: string,
    _automationLevel: AutomationLevel = AutomationLevel.COPILOT
  ) => {
    // 빈 메시지 방지
    if (!message.trim()) return;

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);
    setError(null);

    // Mock: 약간의 지연 시간 (실제 API 호출처럼)
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Mock 응답 가져오기
      const response = getMockResponse(message);

      // conversation_id 저장
      if (!conversationId) {
        setConversationId(response.conversation_id);
      }

      // 승인 필요 여부 체크 (HITL)
      if (response.requires_approval && response.approval_request) {
        setAwaitingApproval(true);
        setApprovalRequest(response.approval_request);
      }

      // AI 응답 추가
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      return response;
    } catch (err) {
      console.error('Mock chat error:', err);

      const errorMessage = err instanceof Error ? err.message : '오류가 발생했습니다.';
      setError(errorMessage);

      // 에러 메시지를 채팅에 표시
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ ${errorMessage} 다시 시도해주세요.`,
        timestamp: new Date()
      }]);

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // Mock 승인 처리
  const handleMockApproval = useCallback(async (
    decision: 'approved' | 'rejected',
    userNotes?: string
  ) => {
    setIsLoading(true);

    // Mock: 약간의 지연
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const response = getMockApprovalResponse(decision);

      // 승인 결과 메시지 추가
      let resultMessage = response.message;
      if (userNotes) {
        resultMessage += `\n\n📝 **메모:** ${userNotes}`;
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: resultMessage,
        timestamp: new Date()
      }]);

      return response;
    } catch (err) {
      console.error('Mock approval error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 승인 완료 후 호출
  const clearApproval = useCallback(() => {
    setAwaitingApproval(false);
    setApprovalRequest(null);
  }, []);

  // 대화 초기화
  const reset = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
    clearApproval();
  }, [clearApproval]);

  return {
    messages,
    conversationId,
    isLoading,
    awaitingApproval,
    approvalRequest,
    error,
    send,
    handleMockApproval,
    clearApproval,
    reset,
  };
}
