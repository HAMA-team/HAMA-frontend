import { apiRequest } from './client';
import type { ChatRequest, ChatResponse } from '@/types/chat';

// 채팅 메시지 전송
export async function sendMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>('/chat/', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// 채팅 히스토리 조회
export async function getChatHistory(
  conversationId: string
): Promise<ChatResponse[]> {
  return apiRequest<ChatResponse[]>(`/chat/history/${conversationId}`);
}

// 채팅 히스토리 삭제
export async function deleteChatHistory(
  conversationId: string
): Promise<void> {
  return apiRequest(`/chat/history/${conversationId}`, {
    method: 'DELETE',
  });
}
