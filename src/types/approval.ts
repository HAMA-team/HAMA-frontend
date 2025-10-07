// 승인 결정 타입
export type ApprovalDecision = 'approved' | 'rejected' | 'modified';

// 승인 요청 페이로드
export interface ApprovalRequestPayload {
  thread_id: string;
  decision: ApprovalDecision;
  automation_level: 1 | 2 | 3;
  modifications?: Record<string, unknown>;
  user_notes?: string;
}

// 승인 응답
export interface ApprovalResponse {
  status: ApprovalDecision;
  message: string;
  conversation_id: string;
  result?: {
    order_id: string;
    status: 'executed' | 'cancelled';
    [key: string]: unknown;
  };
}
