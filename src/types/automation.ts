// 자동화 레벨 Enum
export enum AutomationLevel {
  PILOT = 1,      // 거의 자동
  COPILOT = 2,    // 매매/리밸런싱 승인 (기본값)
  ADVISOR = 3     // 모든 결정 승인
}

// 자동화 레벨 설정
export interface AutomationLevelConfig {
  level: AutomationLevel;
  label: string;
  description: string;
  icon: string;
  interventionFrequency: string;
}

// 자동화 레벨 상수
export const AUTOMATION_LEVELS: AutomationLevelConfig[] = [
  {
    level: AutomationLevel.PILOT,
    label: '파일럿 모드',
    description: 'AI가 거의 모든 것을 처리',
    icon: 'Plane',
    interventionFrequency: '월 1회 확인'
  },
  {
    level: AutomationLevel.COPILOT,
    label: '코파일럿 모드',
    description: 'AI가 제안, 큰 결정만 승인',
    icon: 'Users',
    interventionFrequency: '주 1-2회 알림'
  },
  {
    level: AutomationLevel.ADVISOR,
    label: '어드바이저 모드',
    description: 'AI는 정보만 제공, 사용자 결정',
    icon: 'Info',
    interventionFrequency: '일일 검토 가능'
  }
];
