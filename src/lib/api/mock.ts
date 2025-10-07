import type { ChatResponse, ApprovalRequest } from '@/types/chat';

// Mock 대화 시나리오
export const MOCK_SCENARIOS = [
  // 시나리오 1: 일반 질문 (승인 불필요)
  {
    keywords: ['분석', '어때', '상황', '전망'],
    response: {
      message: `📊 **삼성전자(005930) 분석 결과**

**재무 분석** (실제 DART API 데이터)
- 영업이익: 전년 대비 15% 증가
- PER: 12.5 (업계 평균 14.2)
- ROE: 9.8%

**주가 정보** (실제 FinanceDataReader 데이터)
- 현재가: 73,400원
- 52주 최고가: 89,000원
- 52주 최저가: 65,300원
- 거래량: 15,234,567주

**최근 공시**
- [2025-01-15] 2024년 4분기 실적 발표
- [2025-01-10] 반도체 부문 투자 계획 공시

**종합 의견**
현재 주가는 역사적 평균 PER 대비 저평가 구간입니다. 반도체 업황 회복 기대감이 있으나, 단기 변동성에 주의가 필요합니다.`,
      conversation_id: 'mock-conv-1',
      requires_approval: false,
      metadata: {
        intent: 'stock_inquiry',
        agents_called: ['research_agent'],
        automation_level: 2
      }
    } as ChatResponse
  },

  // 시나리오 2: 매수 주문 (HITL 승인 필요)
  {
    keywords: ['매수', '사줘', '구매', 'buy'],
    response: {
      message: `삼성전자 10주 매수 주문을 준비했습니다.

**주문 상세:**
- 종목: 삼성전자 (005930)
- 수량: 10주
- 예상가: 73,400원
- 총액: 734,000원

⚠️ **승인이 필요합니다**
현재 자동화 레벨(코파일럿)에서는 매매 주문에 승인이 필요합니다.`,
      conversation_id: 'mock-conv-2',
      requires_approval: true,
      approval_request: {
        type: 'trade_approval',
        thread_id: 'mock-thread-123',
        interrupt_data: {
          type: 'trade_approval',
          order_id: 'ORDER_20250107_001',
          stock_code: '005930',
          stock_name: '삼성전자',
          quantity: 10,
          order_type: 'buy',
          estimated_price: 73400,
          estimated_total: 734000,
          message: '삼성전자 10주 매수 승인이 필요합니다.'
        },
        message: '매매 주문 승인이 필요합니다.'
      } as ApprovalRequest,
      metadata: {
        intent: 'trade_execution',
        agents_called: ['master_agent', 'trading_agent'],
        automation_level: 2
      }
    } as ChatResponse
  },

  // 시나리오 3: 매도 주문
  {
    keywords: ['매도', '팔아', '판매', 'sell'],
    response: {
      message: `네이버 5주 매도 주문을 준비했습니다.

**주문 상세:**
- 종목: 네이버 (035420)
- 수량: 5주
- 예상가: 234,500원
- 총액: 1,172,500원

⚠️ **승인이 필요합니다**`,
      conversation_id: 'mock-conv-3',
      requires_approval: true,
      approval_request: {
        type: 'trade_approval',
        thread_id: 'mock-thread-456',
        interrupt_data: {
          type: 'trade_approval',
          order_id: 'ORDER_20250107_002',
          stock_code: '035420',
          stock_name: '네이버',
          quantity: 5,
          order_type: 'sell',
          estimated_price: 234500,
          estimated_total: 1172500,
          message: '네이버 5주 매도 승인이 필요합니다.'
        },
        message: '매매 주문 승인이 필요합니다.'
      } as ApprovalRequest,
      metadata: {
        intent: 'trade_execution',
        agents_called: ['master_agent', 'trading_agent'],
        automation_level: 2
      }
    } as ChatResponse
  },

  // 시나리오 4: 리밸런싱
  {
    keywords: ['리밸런싱', 'rebalancing', '조정', '재조정'],
    response: {
      message: `포트폴리오 리밸런싱 계획을 수립했습니다.

**현재 포트폴리오:**
- IT 섹터: 60% → 목표 50%
- 금융 섹터: 20% → 목표 30%
- 헬스케어: 20% → 목표 20%

⚠️ **승인이 필요합니다**`,
      conversation_id: 'mock-conv-4',
      requires_approval: true,
      approval_request: {
        type: 'rebalancing',
        thread_id: 'mock-thread-789',
        interrupt_data: {
          type: 'rebalancing',
          changes: [
            {
              stock_code: '005930',
              stock_name: '삼성전자',
              current_weight: 35,
              target_weight: 25,
              action: 'sell',
              quantity: 5
            },
            {
              stock_code: '055550',
              stock_name: '신한지주',
              current_weight: 20,
              target_weight: 30,
              action: 'buy',
              quantity: 3
            },
            {
              stock_code: '000660',
              stock_name: 'SK하이닉스',
              current_weight: 25,
              target_weight: 25,
              action: 'hold'
            }
          ],
          message: '포트폴리오 리밸런싱 승인이 필요합니다.'
        },
        message: '리밸런싱 승인이 필요합니다.'
      } as ApprovalRequest,
      metadata: {
        intent: 'portfolio_management',
        agents_called: ['master_agent', 'portfolio_agent'],
        automation_level: 2
      }
    } as ChatResponse
  }
];

// Mock 응답 찾기 (키워드 매칭)
export function getMockResponse(message: string): ChatResponse {
  const lowerMessage = message.toLowerCase();

  // 키워드 매칭
  for (const scenario of MOCK_SCENARIOS) {
    if (scenario.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return scenario.response;
    }
  }

  // 기본 응답
  return {
    message: `안녕하세요! 입력하신 메시지: "${message}"

**Mock 모드 테스트 키워드:**
1. "삼성전자 분석해줘" - 일반 분석 (승인 불필요)
2. "삼성전자 10주 매수해줘" - 매수 주문 (HITL 승인)
3. "네이버 5주 매도해줘" - 매도 주문 (HITL 승인)
4. "리밸런싱 해줘" - 포트폴리오 리밸런싱 (HITL 승인)

위 키워드로 다양한 시나리오를 테스트할 수 있습니다!`,
    conversation_id: 'mock-conv-default',
    requires_approval: false,
    metadata: {
      intent: 'general',
      agents_called: ['general_agent'],
      automation_level: 2
    }
  };
}

// Mock 승인 응답
export function getMockApprovalResponse(decision: 'approved' | 'rejected') {
  if (decision === 'approved') {
    return {
      status: 'approved' as const,
      message: '✅ 주문이 승인되었습니다. 매매가 체결되었습니다.',
      conversation_id: 'mock-conv-approval',
      result: {
        order_id: 'ORDER_20250107_EXECUTED',
        status: 'executed' as const,
        execution_price: 73400,
        execution_time: new Date().toISOString()
      }
    };
  } else {
    return {
      status: 'rejected' as const,
      message: '❌ 주문이 거부되었습니다.',
      conversation_id: 'mock-conv-approval',
      result: {
        order_id: 'ORDER_20250107_CANCELLED',
        status: 'cancelled' as const
      }
    };
  }
}
