// API 에러 타입
export interface APIErrorResponse {
  detail: string;
  status?: number;
  [key: string]: unknown;
}

// 포트폴리오 관련 타입 (추후 확장)
export interface Portfolio {
  total_value: number;
  cash: number;
  holdings: Holding[];
  performance: Performance;
}

export interface Holding {
  stock_code: string;
  stock_name: string;
  quantity: number;
  average_price: number;
  current_price: number;
  value: number;
  profit_loss: number;
  profit_loss_rate: number;
  weight: number;
}

export interface Performance {
  total_return: number;
  total_return_rate: number;
  daily_return?: number;
  daily_return_rate?: number;
}

// 사용자 정보 (추후 확장)
export interface UserProfile {
  id: string;
  automation_level: 1 | 2 | 3;
  risk_tolerance?: 'conservative' | 'moderate' | 'aggressive';
  investment_goals?: string[];
}
