import { apiRequest } from './client';
import type { ApprovalRequestPayload, ApprovalResponse } from '@/types/approval';

// 승인 제출
export async function submitApproval(
  request: ApprovalRequestPayload
): Promise<ApprovalResponse> {
  return apiRequest<ApprovalResponse>('/chat/approve', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
