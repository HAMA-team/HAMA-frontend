// 채팅 메시지 타입
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// 채팅 요청
export interface ChatRequest {
  message: string;
  conversation_id?: string;
  automation_level: 1 | 2 | 3;
}

// 채팅 응답
export interface ChatResponse {
  message: string;
  conversation_id: string;
  requires_approval: boolean;
  approval_request?: ApprovalRequest;
  metadata?: {
    intent?: string;
    agents_called?: string[];
    automation_level: number;
  };
}

// 승인 요청
export interface ApprovalRequest {
  type: 'trade_approval' | 'rebalancing' | 'portfolio_adjustment';
  thread_id: string;
  interrupt_data: TradeApprovalData | RebalancingData;
  message: string;
}

// 거래 승인 데이터
export interface TradeApprovalData {
  type: 'trade_approval';
  order_id: string;
  stock_code: string;
  stock_name?: string;
  quantity: number;
  order_type: 'buy' | 'sell';
  estimated_price?: number;
  estimated_total?: number;
  message: string;
}

// 리밸런싱 데이터
export interface RebalancingData {
  type: 'rebalancing';
  changes: {
    stock_code: string;
    stock_name?: string;
    current_weight: number;
    target_weight: number;
    action: 'buy' | 'sell' | 'hold';
    quantity?: number;
  }[];
  message: string;
}
