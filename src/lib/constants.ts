// 앱 상수 정의

// 자동화 레벨 기본값
export const DEFAULT_AUTOMATION_LEVEL = 2; // COPILOT

// API 타임아웃 (ms)
export const API_TIMEOUT = 30000;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  AUTOMATION_LEVEL: 'hama_automation_level',
  USER_PREFERENCES: 'hama_user_preferences',
  CONVERSATION_ID: 'hama_conversation_id',
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
  API_ERROR: 'API 오류가 발생했습니다.',
  APPROVAL_ERROR: '승인 처리 중 오류가 발생했습니다.',
  INVALID_INPUT: '입력값이 올바르지 않습니다.',
} as const;
