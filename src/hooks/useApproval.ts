import { useState, useCallback } from 'react';
import { submitApproval } from '@/lib/api/approval';
import type { ApprovalDecision } from '@/types/approval';
import { AutomationLevel } from '@/types/automation';

export function useApproval() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approve = useCallback(async (
    threadId: string,
    decision: ApprovalDecision,
    automationLevel: AutomationLevel,
    options?: {
      modifications?: Record<string, unknown>;
      userNotes?: string;
    }
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitApproval({
        thread_id: threadId,
        decision,
        automation_level: automationLevel,
        modifications: options?.modifications,
        user_notes: options?.userNotes,
      });

      return response;
    } catch (err) {
      console.error('Approval error:', err);
      const errorMessage = err instanceof Error ? err.message : '승인 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    approve,
    isSubmitting,
    error,
    clearError,
  };
}
